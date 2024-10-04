import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const FiniteFieldLinearFunctionHamming = () => {
  const [fieldSize, setFieldSize] = useState(5);
  const [slope1, setSlope1] = useState(1);
  const [intercept1, setIntercept1] = useState(0);
  const [slope2, setSlope2] = useState(2);
  const [intercept2, setIntercept2] = useState(1);
  const [points1, setPoints1] = useState([]);
  const [points2, setPoints2] = useState([]);
  const [hammingDistance, setHammingDistance] = useState(0);

  useEffect(() => {
    const newPoints1 = [];
    const newPoints2 = [];
    let distance = 0;
    for (let x = 0; x < fieldSize; x++) {
      const y1 = (slope1 * x + intercept1) % fieldSize;
      const y2 = (slope2 * x + intercept2) % fieldSize;
      newPoints1.push({ x, y: y1 });
      newPoints2.push({ x, y: y2 });
      if (y1 !== y2) distance++;
    }
    setPoints1(newPoints1);
    setPoints2(newPoints2);
    setHammingDistance(distance);
  }, [fieldSize, slope1, intercept1, slope2, intercept2]);

  const renderGrid = () => {
    const grid = [];
    for (let y = fieldSize - 1; y >= 0; y--) {
      const row = [];
      for (let x = 0; x < fieldSize; x++) {
        const isPoint1 = points1.some(p => p.x === x && p.y === y);
        const isPoint2 = points2.some(p => p.x === x && p.y === y);
        let cellClass = 'w-8 h-8 border border-gray-600 flex items-center justify-center ';
        if (isPoint1 && isPoint2) {
          cellClass += 'bg-purple-600 text-white';
        } else if (isPoint1) {
          cellClass += 'bg-blue-600 text-white';
        } else if (isPoint2) {
          cellClass += 'bg-red-600 text-white';
        } else {
          cellClass += 'bg-gray-800 text-gray-300';
        }
        row.push(
          <div key={`${x}-${y}`} className={cellClass}>
            {isPoint1 && isPoint2 ? '◆' : (isPoint1 ? '●' : (isPoint2 ? '■' : ''))}
          </div>
        );
      }
      grid.push(<div key={y} className="flex">{row}</div>);
    }
    return grid;
  };

  const FunctionSelector = ({ label, slope, setSlope, intercept, setIntercept, color }) => (
    <div className={`p-2 rounded ${color}`}>
      <Label className="text-gray-300">{label}</Label>
      <div className="flex space-x-2">
        <div>
          <Label htmlFor={`slope-${label}`} className="text-gray-300">Slope (m):</Label>
          <Select value={slope.toString()} onValueChange={(value) => setSlope(Number(value))}>
            <SelectTrigger id={`slope-${label}`} className="bg-gray-700 text-gray-200 border-gray-600">
              <SelectValue placeholder="Select slope" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
              {Array.from({length: fieldSize}, (_, i) => i).map((m) => (
                <SelectItem key={m} value={m.toString()} className="hover:bg-gray-600">{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor={`intercept-${label}`} className="text-gray-300">Y-intercept (b):</Label>
          <Select value={intercept.toString()} onValueChange={(value) => setIntercept(Number(value))}>
            <SelectTrigger id={`intercept-${label}`} className="bg-gray-700 text-gray-200 border-gray-600">
              <SelectValue placeholder="Select y-intercept" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
              {Array.from({length: fieldSize}, (_, i) => i).map((b) => (
                <SelectItem key={b} value={b.toString()} className="hover:bg-gray-600">{b}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">Linear Functions in Finite Field with Hamming Distance</h2>
      <div className="mb-4">
        <Label htmlFor="fieldSize" className="text-gray-300">Field Size (p):</Label>
        <Select value={fieldSize.toString()} onValueChange={(value) => setFieldSize(Number(value))}>
          <SelectTrigger id="fieldSize" className="bg-gray-700 text-gray-200 border-gray-600">
            <SelectValue placeholder="Select field size" />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 text-gray-200 border-gray-600">
            {[3, 5, 7, 11].map((size) => (
              <SelectItem key={size} value={size.toString()} className="hover:bg-gray-600">{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <FunctionSelector label="Function 1" slope={slope1} setSlope={setSlope1} intercept={intercept1} setIntercept={setIntercept1} color="bg-blue-900" />
        <FunctionSelector label="Function 2" slope={slope2} setSlope={setSlope2} intercept={intercept2} setIntercept={setIntercept2} color="bg-red-900" />
      </div>
      <div className="mb-4">
        {renderGrid()}
      </div>
      <div className="mt-4 text-center">
        <p>Function 1: y = {slope1}x + {intercept1} (mod {fieldSize})</p>
        <p>Function 2: y = {slope2}x + {intercept2} (mod {fieldSize})</p>
        <p className="font-bold mt-2 text-gray-100">Hamming Distance: {hammingDistance}</p>
      </div>
      <div className="mt-4 text-sm">
        <p>● Blue: Points only in Function 1</p>
        <p>■ Red: Points only in Function 2</p>
        <p>◆ Purple: Points in both functions</p>
      </div>
    </div>
  );
};

export default FiniteFieldLinearFunctionHamming;
