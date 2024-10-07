---
title: "Locally Testable Proofs: The PVP Problem" 
description: "Problem"
publishDate: "7 October 2024"
tags: ["linear functions", "error-correcting codes", "property testing", "PCP", "Local Testing"]
draft: false 
---

*This work is supported by a grant from the Mina Foundation*

In his book "Introduction to Property Testing" Oded Goldreich provides a wonderful proof of the how to construct a Probabilistically Checkable Proof(PCP) for NP-complete problems[^1].  This proof uses the partially vanishing polynomial problem(PVPP) as an example of an NP-complete type problem.  In this post we walkthrough Prof. Goldreich's proof with the goal of build intuition around PCPs and local testing.

In computational complexity theory, **Probabilistically Checkable Proofs (PCPs)** are a powerful tool that allows a verifier to check the correctness of a proof by examining only a small portion of it. This method leverages randomness and the properties of polynomials over finite fields to efficiently verify complex statements with high confidence. In this blog post, we explore how to construct a PCP to verify that a given polynomial satisfies a specific equation, using auxiliary polynomials to facilitate the verification process.

# Introduction to the PVPP problem 

The Partially Vanishing Polynomial Problem (PVPP) involves verifying whether a given multivariate polynomial $P$ satisfies a specific vanishing condition when composed with another polynomial $A$ over a finite field $\mathbb{F}$. Specifically, the goal is to check if:
$$
P\big(x, z, y, \tau, A(x), A(y), A(z)\big) = 0
$$
holds for all $x, y, z \in H^m$ and $\tau \in \{0,1\}^3 \subset H$, where $H$ is a subset (often a subfield or small subset) of $\mathbb{F}$. 

The challenge lies in verifying this condition efficiently, even though directly checking it would require evaluating the polynomial at an exponential number of points. The solution involves constructing a PCP over a large alphabet, enabling the verifier to check the condition by making a small number of queries to a proof oracle.  This proof was first described "Proof Verification and Hardness of Approximation Problems"[^2] paper.

## Problem Setup

The proof involves the following components:

1. **Main Polynomial $A$:** An $m$-variate polynomial $A: \mathbb{F}^m \to \mathbb{F}$ of total degree at most $m|H|$, which is supposed to satisfy the vanishing condition with $P$.

2. **Auxiliary Polynomials $A_i$:** A sequence of $3m + 1$ polynomials $A_i: \mathbb{F}^{3m+1} \to \mathbb{F}$ for $i = 1, \dots, 3m+1$. Each $A_i$ is supposed to have total degree $d = (3m|H| + O(1)) \cdot m|H|$.

3. **Vanishing Conditions:** The auxiliary polynomials are designed to assist in verifying that $A_0(x, y, z, \tau) = 0$ on $H^{3m+1}$, where:

   $$
   A_0(x, y, z, \tau) \stackrel{\text{def}}{=} P\big(x, z, y, \tau, A(x), A(y), A(z)\big)
   $$

The core idea is to use a sequence of polynomials $A_i$ that progressively "extend" the vanishing property from a small subset to the entire domain, leveraging low-degree extensions and consistency checks.

We can think of the auxiliary polynomials $A_i$ as conceptually close to the terms sent by the prover in the sumcheck protocol.  And they serve a similiar purpose, with each auxiliary polynomial reducing the size of the previous problem.  

## Constructing the PCP

The prover first builds a proof $\pi$ and sends it to the verifier.  This proof is made up of the following components.  


**1. Constructing the Polynomials**

- **Main Polynomial $A$:**

  - $A$ is an $m$-variate polynomial $A: \mathbb{F}^m \to \mathbb{F}$ with total degree at most $m|H|$.
  - The goal is to verify that $A$ satisfies the vanishing condition with $P$ on $H^{3m+1}$.

  - **Note:** $A$ is the statement we are trying to prove.

- **Auxiliary Polynomials $A_i$:**

  - For $i = 0, 1, \dots, 3m+1$, define polynomials $A_i: \mathbb{F}^{3m+1} \to \mathbb{F}$.
  - Each $A_i$ is supposed to vanish on the set $\mathbb{F}^i H^{3m+1 - i}$, which means:

    $$
    A_i(u, v) = 0 \quad \text{for all } u \in \mathbb{F}^i, v \in H^{3m+1 - i}
    $$

  - The degrees of $A_i$ are bounded by $d = (3m|H| + O(1)) \cdot m|H|$.

**2. Purpose of the Auxiliary Polynomials**

- The auxiliary polynomials help in extending the vanishing condition from a small subset $H^{3m+1}$ to the entire space $\mathbb{F}^{3m+1}$.
- By ensuring that $A_i$ vanishes on $\mathbb{F}^i H^{3m+1 - i}$ and that $A_i$ and $A_{i-1}$ agree on certain lines, we can inductively show that $A_0$ vanishes on $H^{3m+1}$.

## Verifier Protocol

The verification process involves the following steps:

-----
**Step 1: Testing that $A$ is a Low-Degree Polynomial**

- **Objective:** Verify that $A$ has total degree at most $m|H|$.
- **Method:** Perform a **Low-Degree Test** on $A$:
  - Randomly select a line $L$ in $\mathbb{F}^m$. A line is defined as:

    $$
    L = \{ a + b t \mid t \in \mathbb{F} \}
    $$

    where $a, b \in \mathbb{F}^m$, and $b \neq 0$.
  - Restrict $A$ to $L$ to obtain a univariate polynomial $A|_L(t) = A(a + b t)$.
  - Check whether $A|_L(t)$ has degree at most $m|H|$.

- **Reasoning:** If $A$ is of low total degree, then its restriction to any line is a low-degree univariate polynomial.

-----
**Step 2: Testing that Each $A_i$ is of Low Degree**

- **Objective:** Verify that each $A_i$ has total degree at most $d$.
- **Method:** For each $i$:

  - Randomly select a line $L$ in $\mathbb{F}^{3m+1}$.
  - Restrict $A_i$ to $L$ to obtain $A_i|_L(t) = A_i(a + b t)$.
  - Check whether $A_i|_L(t)$ has degree at most $d$.

-----
**Step 3: Testing Consistency Between $A_i$ and $A_{i-1}$**

- **Objective:** Verify that $A_i$ and $A_{i-1}$ agree on $\mathbb{F}^{i-1} H \mathbb{F}^{3m+1 - i}$.
- **Method:**

  - For each $i \in [1, 3m+1]$:

    - Randomly select:

      - $r' = (r_1, \dots, r_{i-1}) \in \mathbb{F}^{i-1}$
      - $r'' = (r_{i+1}, \dots, r_{3m+1}) \in \mathbb{F}^{3m+1 - i}$
      - $e \in H$

    - Evaluate:

      - $A_{i-1}(r', e, r'')$
      - $A_i(r', e, r'')$

    - **Consistency Check:** Accept if $A_{i-1}(r', e, r'') = A_i(r', e, r'')$.

- **Additional Low-Degree Test:**

  - Restrict $A_i$ to the axis-parallel line:

    $$
    L = \{ (r', t, r'') \mid t \in \mathbb{F} \}
    $$

  - Check that $A_i|_L(t)$ is a univariate polynomial of degree at most $d$.

- **Reasoning:**

  - Ensuring that $A_i$ and $A_{i-1}$ agree on $\mathbb{F}^{i-1} H \mathbb{F}^{3m+1 - i}$ helps propagate the vanishing property from $A_i$ to $A_{i-1}$.
  - By induction, if $A_{3m+1}$ vanishes on $\mathbb{F}^{3m+1}$ and the polynomials are consistent, then $A_0$ vanishes on $H^{3m+1}$.
-----
**Step 4: Testing that $A_{3m+1}$ Vanishes on $\mathbb{F}^{3m+1}$**

- **Objective:** Verify that $A_{3m+1}(r) = 0$ for all $r \in \mathbb{F}^{3m+1}$.
- **Method:**

  - Randomly select $r \in \mathbb{F}^{3m+1}$.
  - Evaluate $A_{3m+1}(r)$.
  - **Zero Test:** Accept if $A_{3m+1}(r) = 0$.

- **Reasoning:**

  - Since $A_0(x, y, z, \tau) = P\big(x, z, y, \tau, A(x), A(y), A(z)\big)$, this shows that $P$ satisfies the vanishing condition when composed with $A$.

-----

As you can see from the verification steps listed above, the process of build a PCP verifier for an NP-Complete problem is highly non-trivial and requires several complex steps.  The key to understanding this proof is understanding the recursive structure of the degree reduction between each polynomial.  Fundametally the goal of this PCP is to reduce a large problem, to a very small problem and prove that the small problem directlty ties back to the large problem.

## Inductive Argument

The verification process relies on the following inductive reasoning:

  - Base Case: $A_{3m+1}$ vanishes on $\mathbb{F}^{3m+1}$ by direct testing.
  - Inductive Step: If $A_i$ vanishes on $\mathbb{F}^i H^{3m+1 - i}$ and $A_i$ agrees with $A_{i-1}$ on $\mathbb{F}^{i-1} H \mathbb{F}^{3m+1 - i}$, then $A_{i-1}$ vanishes on $\mathbb{F}^{i-1} H^{3m+1 - (i-1)}$.

By induction, $A_0$ vanishes on $H^{3m+1}$, which is the desired property.
Since $A_0(x, y, z, \tau) = P\big(x, z, y, \tau, A(x), A(y), A(z)\big)$, this shows that $P$ satisfies the vanishing condition when composed with $A$.

## Query Complexity

- **Oracle Length:**

  - The oracle (proof) includes:

    - The evaluations of $A$ over $\mathbb{F}^m$: $|\mathbb{F}|^m$ entries.
    - The evaluations of each $A_i$ over $\mathbb{F}^{3m+1}$: $(3m + 1) \cdot |\mathbb{F}|^{3m+1}$ entries.

  - **Total Length:**

    $$
    |\mathbb{F}|^m + (3m + 1) \cdot |\mathbb{F}|^{3m+1} = O(m \cdot |\mathbb{F}|^{3m+1})
    $$

- **Query Complexity:**

  - The verifier makes queries when performing:

    - Low-degree tests on $A$ and each $A_i$.
    - Consistency checks between $A_i$ and $A_{i-1}$.
    - Zero tests on $A_{3m+1}$.

  - **Total Queries:**

    - Each low-degree test involves querying points along random lines, typically $O(1)$ points per line.
    - The number of lines tested is $O(1)$ per polynomial.
    - For $O(m)$ polynomials, the total queries are $O(m)$.
    - The consistency checks involve querying $A_i$ and $A_{i-1}$ at random points, adding $O(m)$ more queries.

  - **Total Query Complexity:**

    $$
    O(m \cdot |\mathbb{F}|)
    $$

## Conclusion

By constructing auxiliary polynomials and leveraging probabilistic verification techniques, we can efficiently verify complex polynomial equations within a PCP framework. This approach reduces the verification of global properties to local checks, enabling the verifier to detect inconsistencies with high probability while examining only a small portion of the proof.


[^1]: O. Goldreich, *Introduction to Property Testing*. Cambridge: Cambridge University Press, 2017.

[^2]: S. Arora, C. Lund, R. Motwani, M. Sudan and M. Szegedy. *Proof Verification and Intractability of Approximation Problems*. Journal of the ACM, Vol. 45, pages 501–555, 1998. Preliminary version in 33rd FOCS, 1992.
