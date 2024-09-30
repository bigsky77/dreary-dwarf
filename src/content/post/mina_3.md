---
title: "The Elegant Foundation: Plonkish Arithmetization"
description: "Understanding Mina Circuits"
publishDate: "30 September 2024"
tags: ["mina", "recursion", "IVC", "arithmetization", "plonk", "folding"]
draft: false 
---

## Introduction

One of the biggest drivers of the current ZK revolution is the evolution of arithmetization and constraint systems.  This evolution enables more complex computation to be encoded in zero-knowledge.  Over the past decade, almost every major leap forward in ZK is directly tracable to advances in arithmetization.  One of the biggest jumps forward came from the introduction of the Plonk proof system in 2018, which introduced many novel techniques for build highly efficient ad scalable zkSNARKS.  Plonk is the backbone for many modern protocols, specifically for our use case Mina. 

## 1. PLONK-Specific Gate and Constraint Mechanisms

Plonkish arithmetization introduces a significant advancement in representing computational circuits for zero-knowledge proofs. Unlike R1CS, which relies on fixed constraint types, PLONK uses **selector polynomials** to define customizable gates, providing a flexible and efficient way to encode complex operations tailored to specific computational needs.

Key features of Plonkish arithmetization include:

- **Generalized and Flexible Constraint System**: By utilizing selector polynomials, PLONK allows for the creation of customizable gates, enabling a unified approach to representing arbitrary computational circuits within a single, coherent framework.

- **Scalability and Efficiency**: Transforming computational constraints into polynomial equations over the Lagrange basis and using the vanishing polynomial $Z_H(X)$ leverages efficient algebraic operations and Fast Fourier Transforms (FFTs), enhancing scalability.

- **Succinctness and Universality**: PLONK enables the creation of succinct proofs that are independent of circuit size through polynomial commitment schemes and permutation arguments.

### General Form

Given two integers $ \{m,n \} \in F$, we denote the number of wires with $m$ and the number of gates with $n$.  We define the constraint system as $C := (V, Q)$.

- $V = (w_R,w_L,w_O)$ where $w_R,w_L,w_O \in [m]^n$ are the left, right and output sequences.
- $Q = (q_L, q_R, q_O, q_M, q_C) \in F^n$ where each $q_i$ can be thought of a selector vector.

A given witness value $x \in F^m$ satisfies $C$ if the following equation holds true:

$$
q_M \cdot w_L \cdot w_R + q_L \cdot w_L + q_R \cdot w_R + q_O \cdot w_O + q_C = 0
$$

When we instantiate this system for the $n$-gate:

- Addition Gates: If the $n$th gate is an addition gate we set the following $(q_L)_i = 1$, $(q_R)_i = 1$, $(q_M)_i = O$, and $(q_O)_i = -1$.

- Multiplication Gates: And for multiplication we set the following $(q_L)_i = 0$, $(q_R)_i = 0$, $(q_M)_i = 1$, and $(q_O)_i = -1$

- And we always set $(q_C)_i = 0$

The selector vectors can be confusing the first time you see them, especially if you are coming from pure R1CS.  However, they are actually really simple.  Just remember that there main function is to enable gates to containt either addition or multiplication.  Which makes the entire protocol much more flexible.

## 2. Plonkish Arithmetization

### Selector Vectors and Gate Equations

PLONK uses **selector vectors** to define gates in the arithmetic circuit:

- $Q = (q_L, q_R, q_O, q_M, q_C) \in (\mathbb{F}^n)^5$

Each $q_i$ is a vector of length $n$ over a finite field $\mathbb{F}$, representing the selectors for the left input, right input, output, multiplication term, and constant term, respectively.

The general **gate equation** is:

$$
q_M \cdot w_L \cdot w_R + q_L \cdot w_L + q_R \cdot w_R + q_O \cdot w_O + q_C = 0
$$

- $w_L, w_R, w_O$ are the witness values (assignments) for the left input, right input, and output wires.
- The selectors $q_L, q_R, q_O, q_M, q_C$ determine the operation performed by the gate.

### Polynomial Formulation Using Lagrange Basis

To enable efficient computation and proof generation, vectors and operations are represented as polynomials over a finite field.

The Lagrange basis is a set of polynomials used for interpolating a polynomial given its values at distinct points. Given $n$ distinct points $\{x_0, x_1, \dots, x_{n-1}\}$ in a field $\mathbb{F}$, the Lagrange basis polynomials $\{L_0(x), L_1(x), \dots, L_{n-1}(x)\}$ are constructed such that each $L_i(x)$ satisfies $L_i(x_j) = \delta_{ij}$, where $\delta_{ij}$ is the Kronecker delta function.

#### Definition and Properties

Each lagrange basis polynomial is defined as:

$$
l_i(x) = \prod_{\substack{0 \leq j < n \\ j \neq i}} \frac{x - x_j}{x_i - x_j}
$$

#### Interpolating Vectors into Polynomials

Given a vector $w = (w_0, w_1, \dots, w_{n-1})$, we interpolate it into a polynomial $w(X)$ using the Lagrange basis:

$$
w(X) = \sum_{i=0}^{n-1} w_i \cdot L_i(X)
$$

#### Leveraging the Vanishing Polynomial

The vanishing polynomial over $H$ is defined as:

$$
Z_H(X) = \prod_{i=0}^{n-1} (X - x_i)
$$

This polynomial satisfies $Z_H(x_i) = 0$ for all $x_i \in H$. When we perform polynomial arithmetic modulo $Z_H(X)$, we are essentially working within the space of polynomials that agree on the evaluations over $H$. This modulus ensures that any polynomial $Q(X)$ equivalent to $P(X)$ modulo $Z_H(X)$ will satisfy $Q(x_i) = P(x_i) = w_i$.

#### Gate Equation in Polynomial Form

By interpolating the selector vectors and witness vectors into polynomials, the gate equation becomes:

$$
q_M(X) \cdot w_L(X) \cdot w_R(X) + q_L(X) \cdot w_L(X) + q_R(X) \cdot w_R(X) + q_O(X) \cdot w_O(X) + q_C(X) \equiv 0 \mod Z_H(X)
$$

This congruence ensures that the polynomial equation holds at all points in $H$.

## 3. Interpolation of Rows and Columns in PLONK

### Mapping Rows to the Evaluation Domain

In the PLONK protocol, the arithmetic circuit is represented in a tabular form, where each **row** corresponds to a gate, and the **columns** represent different wires (inputs and outputs) and selector values (which define the gate operations). To efficiently work with this tabular representation in the polynomial domain, we associate each row with a unique element from a finite field, forming the **evaluation domain**.

Let:

- $n$ be the number of gates (rows) in the circuit.
- $\omega$ be a primitive $n$-th root of unity in the finite field $\mathbb{F}$.
- The set $H = \{\omega^0, \omega^1, \dots, \omega^{n-1}\}$ represents all the $n$-th roots of unity, forming our evaluation domain.

Each row $i \in \{0, 1, \dots, n-1\}$ is associated with the point $X = \omega^i$ in $H$. This mapping ensures that every row corresponds to a unique point in the field, allowing us to interpolate the columns into polynomials over $\mathbb{F}$.

### Interpolating Columns into Polynomials

Each column in the circuit's table contains values assigned to either the **witness wires** ($w_L$, $w_R$, $w_O$) or the **selector values** ($q_L$, $q_R$, $q_M$, $q_O$, $q_C$). To transform these discrete column values into polynomials, we perform **Lagrange interpolation** using the evaluation domain $H$.

#### Constructing Evaluation Forms

For a given column $c$, we create a set of pairs by zipping the evaluation domain $H$ with the column values:

$$
\text{zip}(H, c) = \{ (\omega^0, c_0), (\omega^1, c_1), \dots, (\omega^{n-1}, c_{n-1}) \}
$$

Here, $c_i$ is the value from column $c$ at row $i$. This set represents the **evaluation form** of the polynomial we wish to construct.

#### Lagrange Interpolation

Using the evaluation form, we interpolate a polynomial $c(X)$ such that:

$$
c(\omega^i) = c_i \quad \text{for all } i \in \{0, 1, \dots, n-1\}
$$

This polynomial $c(X)$ captures all the values in the column, mapped over the evaluation domain $H$. Since the points in $H$ are roots of unity, and the number of points equals the degree of the polynomial, Lagrange interpolation guarantees a unique polynomial of degree less than $n$ that fits these points.

### Connecting Rows, Columns, and Polynomials

Imagine the circuit's table as follows:
- **Columns:** Each vertical column is interpolated into a polynomial.
- **Rows:** Each horizontal row corresponds to evaluations of these polynomials at $X = \omega^i$.

| Row $i$ | $w_{L,i}$ | $w_{R,i}$ | $w_{O,i}$ | $q_{L,i}$ | $q_{R,i}$ | $q_{M,i}$ | $q_{O,i}$ | $q_{C,i}$ |
|---------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|-----------|
| 0 | $w_{L,0}$ | $w_{R,0}$ | $w_{O,0}$ | $q_{L,0}$ | $q_{R,0}$ | $q_{M,0}$ | $q_{O,0}$ | $q_{C,0}$ |
| 1 | $w_{L,1}$ | $w_{R,1}$ | $w_{O,1}$ | $q_{L,1}$ | $q_{R,1}$ | $q_{M,1}$ | $q_{O,1}$ | $q_{C,1}$ |
| $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ | $\vdots$ |
| $n-1$ | $w_{L,n-1}$ | $w_{R,n-1}$ | $w_{O,n-1}$ | $q_{L,n-1}$ | $q_{R,n-1}$ | $q_{M,n-1}$ | $q_{O,n-1}$ | $q_{C,n-1}$ |

By associating each row with a unique point in $H$ and interpolating each column into a polynomial, we establish a direct correspondence between the circuit's tabular representation and its polynomial form. 

This connection allows us to:

- **Express Gate Constraints**: The gate equations can be expressed as polynomial identities that must hold at all points in $H$.
- **Apply the Permutation Argument**: The permutation polynomials $\sigma_L(X)$, $\sigma_R(X)$, and $\sigma_O(X)$ map wire positions in the domain, enforcing copy constraints via polynomial relationships.
- **Utilize the Vanishing Polynomial**: Working modulo the vanishing polynomial $Z_H(X)$ ensures that polynomial equations are considered only at the points in $H$, aligning with the circuit's rows.

### Mathematical Illustration

#### Lagrange Basis Polynomials

Recall that the Lagrange basis polynomials $L_i(X)$ are defined as:

$$
L_i(X) = \prod_{\substack{0 \leq j < n \\ j \neq i}} \frac{X - \omega^j}{\omega^i - \omega^j}
$$

These polynomials satisfy:

$$
L_i(\omega^j) = \delta_{ij}
$$

where $\delta_{ij}$ is the Kronecker delta function.

#### Interpolating a Column

Given a column of values $c = (c_0, c_1, \dots, c_{n-1})$, we interpolate it into a polynomial $c(X)$ using the Lagrange basis:

$$
c(X) = \sum_{i=0}^{n-1} c_i \cdot L_i(X)
$$

This polynomial satisfies $c(\omega^i) = c_i$ for all $i$.

#### Example with Selector Polynomials

Suppose the selector polynomial $q_M(X)$ is associated with the multiplication operation in gates. Given selector values $q_{M,0}, q_{M,1}, \dots, q_{M,n-1}$, we interpolate:

$$
q_M(X) = \sum_{i=0}^{n-1} q_{M,i} \cdot L_i(X)
$$

This polynomial is then used in the gate equation:

$$
q_M(X) \cdot w_L(X) \cdot w_R(X) + \dots \equiv 0 \mod Z_H(X)
$$

In PLONK arithmetization, each of the selector vectors $q_{\{\}}$ and witness vectors $w_L, w_R, w_O$ is interpolated into its own polynomial. Thus, **each column in the circuit's tabular representation corresponds to a polynomial**.

### Columns as Polynomials

- **Selector Polynomials**: Each selector vector $q_L, q_R, q_M, q_O, q_C$ is interpolated into a selector polynomial $q_L(X), q_R(X), q_M(X), q_O(X), q_C(X)$.
- **Witness Polynomials**: Similarly, the witness vectors $w_L, w_R, w_O$ are interpolated into witness polynomials $w_L(X), w_R(X), w_O(X)$.

These polynomials are constructed so that at each point $X = \omega^i$ in the evaluation domain $H$, the polynomial evaluates to the value in the corresponding row and column of the circuit:

$$
\begin{align*}
q_L(\omega^i) &= q_{L,i} \\
q_R(\omega^i) &= q_{R,i} \\
q_M(\omega^i) &= q_{M,i} \\
\vdots \\
w_L(\omega^i) &= w_{L,i} \\
w_R(\omega^i) &= w_{R,i} \\
w_O(\omega^i) &= w_{O,i}
\end{align*}
$$

### Rows as Evaluation Points

Each row corresponds to an evaluation point $X = \omega^i$ in the domain $H$:

- **Rows**: Represent individual gates or constraints in the circuit.
- **Evaluation Points**: The points $\omega^i$ at which the polynomials are evaluated to obtain the values for each row.

When you evaluate all the polynomials at a specific $X = \omega^i$, you retrieve all the values (witnesses, selectors, etc.) for **row $i$** of the circuit.

### Putting It All Together

By mapping columns to polynomials and rows to evaluation points, we can:

1. **Express Gate Constraints**: By evaluating the gate equations at each $X = \omega^i$, we ensure that the constraints are satisfied at every gate (row) in the circuit.
   
   For example, the general gate equation in polynomial form is:
   
   $q_M(X) \cdot w_L(X) \cdot w_R(X) + q_L(X) \cdot w_L(X) + q_R(X) \cdot w_R(X) + q_O(X) \cdot w_O(X) + q_C(X) \equiv 0 \mod Z_H(X)$
   
   At each point $X = \omega^i$, this becomes:
   
   $q_{M,i} \cdot w_{L,i} \cdot w_{R,i} + q_{L,i} \cdot w_{L,i} + q_{R,i} \cdot w_{R,i} + q_{O,i} \cdot w_{O,i} + q_{C,i} = 0$

2. **Enforce Copy Constraints**: Through the permutation argument, we ensure that variables shared across different rows have consistent values by comparing polynomial evaluations at specific points.

3. **Utilize Polynomial Identities**: By working in the polynomial domain, we can perform efficient computations and leverage algebraic techniques to verify the correctness of the circuit globally.


## 4. Step-by-Step Example

Let's illustrate the arithmetization process with an example.

### Setup

**Constraints:**

- We have $n = 2$ gates.

**Witness values:**

- $w_L = (2, 3)$
- $w_R = (4, 5)$
- $w_O = (8, 15)$

**Selector values:**

- $q_M = (1, 1)$ (enabling multiplication)
- $q_O = (-1, -1)$ (moving $w_O$ to the left-hand side)
- $q_L = q_R = q_C = (0, 0)$

Our goal is to verify that $w_L \cdot w_R - w_O = 0$ at each gate.

### Step 1: Verify Gate Equations at Evaluation Points

For each gate ($i = 0$ and $i = 1$), we check:

$$
q_M[i] \cdot w_L[i] \cdot w_R[i] + q_O[i] \cdot w_O[i] = 0
$$

- **At $i = 0$:**

  $$
  1 \cdot 2 \cdot 4 + (-1) \cdot 8 = 8 - 8 = 0
  $$

- **At $i = 1$:**

  $$
  1 \cdot 3 \cdot 5 + (-1) \cdot 15 = 15 - 15 = 0
  $$

The gate equations hold at both points.

### Step 2: Construct Lagrange Basis Polynomials

For $n = 2$, with evaluation points $x_0 = 0$ and $x_1 = 1$:

- $L_0(X) = \frac{X - x_1}{x_0 - x_1} = \frac{X - 1}{0 - 1} = 1 - X$
- $L_1(X) = \frac{X - x_0}{x_1 - x_0} = \frac{X - 0}{1 - 0} = X$

### Step 3: Interpolate Witness and Selector Polynomials

**Witness Polynomials:**

- $w_L(X) = 2 \cdot L_0(X) + 3 \cdot L_1(X) = 2(1 - X) + 3X = 2 - 2X + 3X = 2 + X$
- $w_R(X) = 4 \cdot L_0(X) + 5 \cdot L_1(X) = 4(1 - X) + 5X = 4 - 4X + 5X = 4 + X$
- $w_O(X) = 8 \cdot L_0(X) + 15 \cdot L_1(X) = 8(1 - X) + 15X = 8 - 8X + 15X = 8 + 7X$

**Selector Polynomials:**

- $q_M(X) = 1 \cdot L_0(X) + 1 \cdot L_1(X) = 1(1 - X) + X = 1$
- $q_O(X) = (-1) \cdot L_0(X) + (-1) \cdot L_1(X) = -1(1 - X) - X = -1 + X - X = -1$
- $q_L(X) = q_R(X) = q_C(X) = 0$

### Step 4: Formulate the Polynomial Gate Equation

Substitute the polynomials into the gate equation:

$$
q_M(X) \cdot w_L(X) \cdot w_R(X) + q_O(X) \cdot w_O(X) \equiv 0 \mod Z_H(X)
$$

Simplify:

$$
(1) \cdot (2 + X) \cdot (4 + X) + (-1) \cdot (8 + 7X) \equiv 0 \mod Z_H(X)
$$

Compute the product $w_L(X) \cdot w_R(X)$:

$$
(2 + X)(4 + X) = 8 + 6X + X^2
$$

Compute the left-hand side polynomial:

$$
[8 + 6X + X^2] - [8 + 7X] = (6X - 7X) + X^2 = -X + X^2
$$

So, the left-hand side polynomial is:

$$
X^2 - X
$$

### Step 5: Compute the Vanishing Polynomial $Z_H(X)$

For $H = \{0, 1\}$:

$$
Z_H(X) = (X - 0)(X - 1) = X^2 - X
$$

### Step 6: Verify the Congruence Modulo $Z_H(X)$

We have:

$$
X^2 - X \equiv 0 \mod X^2 - X
$$

Since $X^2 - X - 0 = X^2 - X$, the left-hand side polynomial is exactly $Z_H(X)$, so the congruence holds.

This confirms that the polynomial gate equation holds modulo the vanishing polynomial.

By correctly formulating the gate equation and including all relevant selector polynomials, the arithmetization process accurately captures the computational constraints. The polynomial congruence modulo the vanishing polynomial ensures that the gate equations hold at all points in $H$.

## Conclusion

In this deep dive, we've explored the core components of the PLONK proof system used in Mina by examining the Lagrange basis, polynomial representation, and arithmetization process. We discussed how the Lagrange basis allows interpolation of polynomials through given data points, transforming vectors into polynomials.

The arithmetization section provided a mathematical framework for encoding computational constraints into polynomial equations. We examined how selector vectors and unified multiplication/addition gates are used to formulate these constraints, ensuring they hold modulo the vanishing polynomial.

With a solid understanding of these foundational concepts, we are now prepared to explore more advanced components of PLONK and Kimchi, specifically lookups and customizable gates.

## References

- [Plonk Whitepaper](https://eprint.iacr.org/2019/953.pdf)
- [PLONKish Arithmetization](https://www.youtube.com/watch?v=-SXMd6S0r0I&ab_channel=yAcademy)
- [Standard PLONK Arithmetization](https://hackmd.io/@jake/plonk-arithmetization#Standard-PLONK-Arithmetization)
- [Gnark Plonk](https://hackmd.io/@gnark/plonk)
- [Mina Kimchi](https://o1-labs.github.io/proof-systems/kimchi/overview.html)
