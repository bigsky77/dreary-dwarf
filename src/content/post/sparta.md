---
title: "Gateway to Nova: Folding and proving CCS constraints"
description: "SuperSparta and HyperNova"
publishDate: "14 August 2024"
tags: ["sumcheck", "algorithms", "IOP", "arithmetization", "ccs"]
draft: true 
---
_Note: This is a WIP draft and has not been peer reviewed._

Questions for Abhiram

1) Is relaxed R1CS the same as CCS?
2) Tradeoffs between Accumulation schemes and folding
3) Difference from polynomial folding?
4) How does proof size scale?
5) Difference between spartan based IVC and NOVA

## CCS Arithmetization

Customizable Constraint System (CCS), is a generalized constraint system that can
simultaneously capture R1CS, Plonkish, and AIR constraints.

$$
\sum_{i=1}^{q-1}c_i \cdot \bigcirc_{j \in S_i} M_j \cdot z = 0
$$

Where $z$:

$$
z = (w, 1,x) \in \mathbb{F}^n
$$

A relation can be represented in CCS form in the following way: 

$$
c_1 \cdot (M_1 \cdot z \circ M_2 \cdot z) + c_2 \cdot (M_3 \cdot z) = 0
$$

Where $z$ contains the elements of our relation.

Now let's visualize the actual transformation we want:

### Boolian gates

We will be working with boolian gates, of the form.

$$
\begin{array}{|l|c|c|c|}
\hline
\textbf{Gate} & \textbf{Boolean Expression} & \textbf{Arithmetic Version} & \textbf{Domain} \\
\hline
AND & x \wedge y & xy & \{0,1\} \\
\hline
OR & x \vee y & x + y - xy & \{0,1\} \\
\hline
NOT & \neg x & 1 - x & \{0,1\} \\
\hline
XOR & x \oplus y & x + y - 2xy & \{0,1\} \\
\hline
NAND & \neg(x \wedge y) & 1 - xy & \{0,1\} \\
\hline
\end{array}
$$


Let's start with converting the following statement to CCS form: 

$$
f(x1, x2, x3) = (\ NOT \ x_1 \ AND \ x_2) \ AND \  (\ x_3 \ OR \  x_4)
$$

First, we'll break this expression down into component parts.

Step 1: Break down the expression

$$
a = NOT \ x_1  \\
b = a \ AND  \ x_2 \\ 
c = x_3 \ OR \ x_4 \\
d = b \ AND\  c \\
$$

Step 2: Convert each operation to its arithmetic equivalent and write constraints

$$
1. NOT \ operation: a = 1 - x_1 \\
2. AND \ operation: b = a * x_2 \\
3. OR \ operation: c = x_3 + x_4 - x_3 * x_4 \\
4. AND \ operation: d = b * c \\
$$


Now we define our variable vector:
$$
x = (1, x_1, x_2, x_3, x_4, a, b, c, d)
$$

This vector represents all the variables in our system. It includes:
- A constant 1 (often used in R1CS)
- Input variables: x1, x2, x3, x4
- Intermediate variables: a, b, c
- Output variable: d

For the NOT operation, we want to represent a + x = 1. Let's go through each matrix:

1. M1 (Left) Matrix:

$$
M1 = \begin{bmatrix}
1 & 1 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0
\end{bmatrix}
$$

- The first row (1, 1, 0, 0) represents 1 + x.
- We want M1 · x to equal 1 + x, so we put 1 in the first column (for the constant 1) and 1 in the second column (for x).
- The other rows are 0 as we don't need them for this operation.

2. M2 (Right) Matrix:

$$
M2 = \begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0
\end{bmatrix}
$$

- We want M2 · x to equal 1 (because we're multiplying (1 + x) by 1).
- So we put 1 in the first column of the first row (to select the constant 1 from our x vector).
- All other entries are 0.

3. M3 (Output) Matrix:

$$
M3 = \begin{bmatrix}
1 & 0 & 1 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0 \\
0 & 0 & 0 & 0
\end{bmatrix}
$$

- We want M3 · x to equal 1 + a (the right side of our equation a + x = 1, rearranged).
- So we put 1 in the first column (for the constant 1) and 1 in the third column (for a).
- All other entries are 0.

Now, when we apply these matrices to our variable vector x:

$$
(M1 · x) * (M2 · x) = (M3 · x)
(1 + x) * (1) = (1 + a)
$$

This correctly represents our constraint $a + x = 1$, or $a = 1 - x$ (the NOT operation).

### Multilinear Extension

## SuperSpartan Protocol

1. $\mathcal{P} \rightarrow \mathcal{V}$: Sending a multivariate polynomial $\tilde{W}$
2. $\mathcal{V} \rightarrow \mathcal{P}$: Sending random challenges $\tau \in_R \mathcal{F}^{log \ m}$
3. $\mathcal{P} \leftrightarrow \mathcal{V}$: Run sumcheck reduction

    a. Apply sumcheck protocol 
    
    $$
    g(a) := \tilde(eq)(\tau, a) \cdot \sum_{i=0}^{q-1} c_i \prod_{j \in S_i} \left( \sum_{y \in {0,1}^{log \ m}} \tilde{M}_j(a, y) \cdot \tilde{Z}(y) \right)
    $$ 
    
    and confirm that $g$ is equal to 0:
    
    $$
    \sum_{\mathcal{b} \in \{0,1\}^{log \ m}} g(b) 
    $$
    
    b.$\mathcal{V} \rightarrow \mathcal{P}$: Choose a random $\tau \in \mathbb{F}$ and send to $\mathcal{P}$ 

    c. $\mathcal{P} \leftrightarrow \mathcal{V}$: Apply sumcheck a second time and check
    
    $$
    \sum_{i=0}^{t-1} \sum_{y \in \{0,1\}^{log \ n}} \tau^i \cdot \tilde{M}_i (r_a, y) \cdot  \tilde{Z}(y)  
    $$

4. $\mathcal{V}$: Checks that

    a. $\forall i \in \{0, 1, ..., t-1\}, \tilde{M}_i(r_x, r_y) = v_i$ with a single query to $\tilde{M_i}$

    b. Check that $\tilde{Z}(r_y) = v_z$ by checking:
    
    $$
    v_z = (1 - r_y[1]) \cdot v_w + r_y[1] \cdot \tilde{(x, 1)}(r_y[2..])
    $$
    
    where $r_y[2..]$ refers to a slice of $r_y$ without the first element of $r_y$,  and where $v_w \leftarrow \tilde{W}(r_y[2..])$ represents an oracle query.

### HyperNova Protocol

### Reference

