---
title: "The Elegant Foundation: Plonkish Arithmetization"
description: "Understanding Mina Circuits"
publishDate: "30 September 2024"
tags: ["mina", "recursion", "IVC", "arithmetization", "plonk", "folding"]
draft: true 
---

## **1. PLONK-Specific Gate and Constraint Mechanisms**

PLONK introduces advanced techniques to handle gates and constraints more efficiently, enabling scalability and flexibility. Let's explore the key components:

### **1.1. Selector Polynomials**

**Purpose:** Determine which gate is active at each gate position in the circuit.

**Definition:** For each gate type (e.g., addition, multiplication), there is a corresponding selector polynomial. These polynomials take non-zero values where their respective gate is active and zero otherwise.

**Mathematical Representation:**

Let $S_+$ and $S_\times$ be selector polynomials for addition and multiplication gates, respectively. For gate position $i$:

$S_+ (i) =
\begin{cases}
1 & \text{if gate } i \text{ is addition} \\
0 & \text{otherwise}
\end{cases}$

$S_\times (i) =
\begin{cases}
1 & \text{if gate } i \text{ is multiplication} \\
0 & \text{otherwise}
\end{cases}$

### **1.2. Gate Constraints in PLONK**

PLONK expresses constraints for all gates in a unified manner using selector polynomials and permutation arguments.

#### **1.2.1. General Constraint Equation**

For each gate position $i$, the following equation must hold:

$S_+(i) \cdot (z_i - x_i - y_i) + S_\times(i) \cdot (z_i - x_i \cdot y_i) = 0$

**Explanation:**

- If gate $i$ is an addition gate, $S_+(i) = 1$ and $S_\times(i) = 0$, enforcing $z_i = x_i + y_i$.
- If gate $i$ is a multiplication gate, $S_+(i) = 0$ and $S_\times(i) = 1$, enforcing $z_i = x_i \times y_i$.
- For other gate types, additional selector polynomials and corresponding terms would be included.

### **1.3. Permutation Arguments**

**Purpose:** Ensure that variable assignments are consistent across the entire circuit without revealing their identities. This is crucial for maintaining the zero-knowledge property.

**Mechanism:**

1. **Variable Permutation:** Variables are permuted using a permutation polynomial, ensuring that each instance of a variable across different gates refers to the same underlying value.
2. **Consistency Enforcement:** Constraints are added to ensure that permuted variables align correctly with their original assignments.

---

## **2. Mathematical Intuition of PLONK Constraints**

Let's formalize the PLONK constraint system mathematically.

### **2.1. Defining the Polynomial Commitments**

Let:

- $L(X)$, $R(X)$, $O(X)$ be polynomials representing the left input, right input, and output of each gate, respectively.
- $S_+(X)$, $S_\times(X)$ be selector polynomials for addition and multiplication gates.
- $Z(X)$ represent the output polynomial.

### **2.2. PLONK Constraint Polynomial**

The constraint polynomial $C(X)$ combines all gate constraints:

$C(X) = S_+(X) \cdot (Z(X) - L(X) - R(X)) + S_\times(X) \cdot (Z(X) - L(X) \cdot R(X))$

**Requirement:** $C(X)$ must evaluate to zero for all $X$ in the domain.

### **2.3. Example Calculation**

Consider a simple circuit with two gates:

1. **Gate 0:** Addition ($s = x + y$)
2. **Gate 1:** Multiplication ($z = s \times w$)

Assume the domain $X = \{0, 1\}$.

- **Gate 0:**
  - $L(0) = x$
  - $R(0) = y$
  - $Z(0) = s$
  - $S_+(0) = 1$, $S_\times(0) = 0$

- **Gate 1:**
  - $L(1) = s$
  - $R(1) = w$
  - $Z(1) = z$
  - $S_+(1) = 0$, $S_\times(1) = 1$

**Constraint Polynomial:**

$C(X) = S_+(X) \cdot (Z(X) - L(X) - R(X)) + S_\times(X) \cdot (Z(X) - L(X) \cdot R(X))$

**Evaluations:**

- **At $X = 0$:**

$C(0) = 1 \cdot (s - x - y) + 0 \cdot (z - s \cdot w) = s - x - y = 0$

- **At $X = 1$:**

$C(1) = 0 \cdot (z - s - w) + 1 \cdot (z - s \cdot w) = z - s \cdot w = 0$

Thus, the constraint polynomial evaluates to zero at both points, satisfying the constraints.

## **3 Custom Gates in the Mina Protocol**

The Mina protocol utilizes a customized version of PLONK, known as Kimchi, which incorporates custom gates to enhance efficiency for specific computations. These custom gates are crucial for optimizing operations such as Poseidon hashing and elliptic curve operations.

#### **3.1 PLONK Configuration in Mina**

In Mina's implementation of PLONK, a configuration specifies:

1. A set of custom constraint types
2. A number of "eq-able" columns (W)
3. A number of "advice" columns (A)

A circuit within this configuration is then defined by:

1. The number of rows (n)
2. A vector of constraint types for each row
3. A vector of equality constraints between specific positions in the table

#### **3.2 Designing Custom Gates**

When designing a custom gate for Mina, the key consideration is to express the gate's functionality as a set of multivariate polynomial equations. These equations use variables representing the values in each column of the current and next rows of the execution trace.

For example, a custom gate for Poseidon hashing or elliptic curve operations would define equations that capture the specific computations involved in these operations.

#### **3.3 Constraint Representation**

In the Mina protocol, constraints for custom gates are represented using the `Expression` framework. This allows developers to write equations generically, using placeholders for each column in the execution trace. 

For instance, the i-th column of the current row is represented as:

```rust
E::<F>::cell(Column::Witness(i), CurrOrNext::Curr)
```

Or more succinctly:

```rust
witness_curr(i)
```

#### **3.4 From Multivariate to Univariate Polynomials**

To fit within the PLONK framework, these multivariate constraint equations are transformed into univariate polynomials through interpolation. This process creates witness polynomials that evaluate to the cells of the execution trace:

```
w_j(g^i) = trace[i, j]
```

Where `g` is a generator of the multiplicative group used in the protocol.

#### **3.5 Selector Polynomials**

Custom gates in Mina use selector polynomials to indicate which constraints should be applied in each row of the execution trace. These selector polynomials are mutually exclusive, ensuring that only one gate type is active for each row.

#### **3.6 Combining Constraints**

All constraints for a custom gate are combined into a single, large polynomial equation. This is done by:

1. Multiplying each constraint by its corresponding selector polynomial
2. Using powers of a challenge variable (α) to separate different constraints within the same gate
3. Summing all these terms

The resulting equation looks like:

```
gates(X) = selector_1(X) * (constraint_1_1 + α * constraint_1_2 + ...) +
           selector_2(X) * (constraint_2_1 + α * constraint_2_2 + ...) +
           ...
```

#### **3.7 Verification Process**

The verifier in the Mina protocol checks the validity of these custom gates by:

1. Receiving commitments to the witness polynomials from the prover
2. Reconstructing the combined constraint polynomial using these commitments and the known circuit description
3. Verifying that this polynomial equals zero at all points in the domain of the execution trace

By using custom gates, Mina can optimize its proof system for specific, frequently used operations, improving the overall efficiency of the protocol.

## Reference

[GW20] A. Gabizon and Z. J. Williamson. plookup: A simplified polynomial protocolfor lookup tables. Cryptology ePrint Archive, Paper 2020/315, 2020. https://eprint.iacr.org/2020/315
