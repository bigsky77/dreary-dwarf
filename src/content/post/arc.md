---
title: "ARC: Accumulation for Reed-Solomon Codes"
description: "A deep dive into hash-based accumulation schemes for Reed-Solomon codes"
publishDate: "30 November 2024"
tags: ["cryptography", "zero-knowledge proofs", "accumulation schemes", "Reed-Solomon codes", "PCD"]
draft: False
---

*This work is supported by a grant from the Mina Foundation*

## Introduction

Proof-Carrying Data (PCD) has emerged as a fundamental tool in cryptography, enabling the verification of incremental distributed computations. PCD finds applications across various domains, from enforcing language semantics in distributed settings to blockchain consensus protocols. The current state-of-the-art PCD constructions rely heavily on accumulation or folding schemes.

However, most existing accumulation schemes face significant limitations:

1. **Homomorphic Vector Commitments**: Nearly all known constructions depend on homomorphic vector commitments, leading to:
   - High computational costs from expensive group operations
   - Vulnerability to quantum attacks (for discrete log-based schemes)
   - Inability to leverage advances in IOP-based SNARKs

2. **Bounded Accumulation**: Recent hash-based approaches introduce bounds on consecutive accumulation steps, limiting the depth of PCD computation graphs and affecting efficiency.

ARC (Accumulation for Reed-Solomon Codes) presents a novel solution that overcomes these limitations through an unbounded hash-based accumulation scheme. The core innovation is a new accumulation scheme for claims about proximity to Reed-Solomon codes.

## Preliminaries

Before diving into ARC's technical details, let's establish the key mathematical concepts and notations used throughout the paper.

### Reed-Solomon Codes

A Reed-Solomon code $\text{RS}[F, L, d]$ is defined over a field $F$ and evaluation domain $L \subset F$, with degree parameter $d$. It consists of all functions $f: L \to F$ that can be expressed as evaluations of polynomials of degree less than $d$:

$$\text{RS}[F, L, d] := \{f: L \to F \mid f \text{ is the evaluation of a polynomial of degree } < d\}$$

The rate $\rho$ of the code is defined as $\rho = d/|L|$. For a codeword $f$ in $\text{RS}[F, L, d]$, we denote by $\hat{f}$ its unique polynomial representation.

### Distance Measures

For words $f, g: L \to F$, we define:

- **Relative Hamming distance**: $\Delta(f, g)$ is the fraction of points in $L$ where $f$ and $g$ disagree
- **δ-close**: Two words are $\delta$-close if $\Delta(f, g) \leq \delta$
- **δ-far**: Two words are $\delta$-far if $\Delta(f, g) > \delta$
- **Distance to code**: $\Delta(f, \text{RS}[F, L, d]) = \min\{\Delta(f, c) \mid c \in \text{RS}[F, L, d]\}$

### Polynomial Quotients

For a word $f: L \to F$ and points $(x_1, y_1),...,(x_t, y_t)$, we define the quotient:

$$\text{Quotient}(f, (x_1, y_1),...,(x_t, y_t))(X) := \frac{f(X) - p(X)}{V(X)}$$

where:
- $p(X)$ is the Lagrange interpolation of points $(x_i, y_i)$
- $V(X) = \prod_i(X - x_i)$ is the vanishing polynomial

### List Decoding

For parameters $\gamma$ and $\ell$, a Reed-Solomon code is $(\gamma, \ell)$-list decodable if for any word $f$, there are at most $\ell$ codewords that are $\gamma$-close to $f$. The Johnson bound states that $\text{RS}[F, L, d]$ is $(1-\sqrt{\rho}-\eta, O(1/\eta\sqrt{\rho}))$-list decodable for any $\eta > 0$.

### Random Linear Combinations

A key principle used in ARC is that random linear combinations preserve distance properties. Specifically, if $f_1$ and $f_2$ are $\delta$-far from the code, then for random $r \in F$:

$$f = f_1 + r\cdot f_2$$

is also $\delta$-far from the code with high probability over $r$.

This preliminary knowledge forms the foundation for understanding ARC's accumulation scheme and its efficiency guarantees. The interplay between these concepts - particularly the relationship between polynomial quotients and distance preservation - is central to ARC's design.


## Key Techniques

### Reed-Solomon Proximity Claims

At the heart of ARC is a many-to-one reduction for Reed-Solomon proximity claims. Let's break down the key concepts:

**Background:**
- Let $L$ be a subset of field $F$ of size $n$ (evaluation domain)
- Reed-Solomon code RS[d] ⊂ $F^n$ contains words $f: L → F$ consistent with polynomials of degree < d
- The quotient of a word $f$ relative to points $(x, y)$ is defined as:

$$ Quotient(f, x, y)(X) := \frac{f(X) - y}{X - x} $$

**Key Properties:**
1. If $f$ is a codeword in RS[d] with $y = f(x)$, then $Quotient(f, x, y)$ is a codeword in RS[d-1]
2. If $Quotient(f, x, y)$ is δ-close to RS[d-1], then $f$ is δ-close to a codeword $u ∈ RS[d]$ with $u(x) = y$
3. If $f$ is δ-far from any codeword with $u(x) = y$, then $Quotient(f, x, y)$ is δ-far from RS[d-1]

### The ARC Protocol

ARC introduces a novel distance-preserving reduction for Reed-Solomon proximity claims that avoids the limitations of bounded accumulation depth. Let's examine the protocol in detail.

#### Protocol Overview

The core protocol operates on proximity claims about two vectors $f_1, f_2 \in \mathbb{F}^n$. The goal is to reduce the claim that both vectors are $\delta$-close to $\text{RS}[F,L,d]$ to a claim that a single vector is $\delta$-close to $\text{RS}[F,L,d]$.

#### Protocol Steps

1. **Initial Setup and Random Combination**
   - Verifier samples random challenge $r \leftarrow \mathbb{F}$
   - Prover computes and sends word $f: L \to \mathbb{F}$
   - In the honest case, $f := f_1 + r \cdot f_2$
   - This step leverages proximity gaps for Reed-Solomon codes: if either $f_1$ or $f_2$ is $\delta$-far from the code, then $f$ will be $\delta$-far with high probability

2. **Out-of-Domain Sampling**
   - Verifier samples $x_{out} \in \mathbb{F} \setminus L$
   - Prover responds with claimed evaluation $y_{out}$
   - When $\delta$ is less than list-decoding radius, this ensures uniqueness of nearby codewords
   - With high probability, there exists a unique codeword $u$ in the $\delta$-ball satisfying $u(x_{out}) = y_{out}$

3. **In-Domain Query Selection**
   - Verifier samples locations $x_1,...,x_t \leftarrow L$ 
   - Parameter $t := \frac{\lambda}{-\log(1-\delta)}$ determines number of queries
   - These points will be used to define the quotient polynomial

4. **Quotient Formation**
   - For each $j \in [t]$, verifier computes $y_j := f_1(x_j) + r \cdot f_2(x_j)$
   - Let $S := \{x_{out}, x_1,...,x_t\}$ be the combined query set
   - Define function $\text{Ans}: S \to \mathbb{F}$ where:
     - $\text{Ans}(x_{out}) = y_{out}$
     - $\text{Ans}(x_j) = y_j$ for $j \in [t]$
   - Prover sends $\text{Fill}: \{x_j\}_{j \in [t]} \to \mathbb{F}$
   - The quotient is defined as:
   $$q := \text{Quotient}(f, S, \text{Ans}, \text{Fill})$$

5. **Final Reduction**
   - The protocol reduces to the claim that $q$ is $\delta$-close to $\text{RS}[F,L,d-|S|]$
   - Key properties of this reduction:
     * Claim size is independent of number of accumulated claims
     * Distance properties are preserved exactly
     * No error amplification occurs

#### Soundness Analysis

The soundness of the protocol relies on several key properties:

1. **Random Combination Property**
   - If either $f_1$ or $f_2$ is $\delta$-far from $\text{RS}[F,L,d]$, then $f := f_1 + r \cdot f_2$ will be $\delta$-far with high probability over $r$

2. **Out-of-Domain Uniqueness**
   - With probability at least $1 - \frac{\ell^2}{2} \cdot (\frac{d-1}{|\mathbb{F}|-|L|})^s$, different codewords in the list-decoding radius will evaluate differently at random points
   - This ensures unique binding to a nearby codeword when one exists

3. **In-Domain Coverage**
   - With probability at least $1-(1-\delta)^t$, the in-domain queries will detect if $f$ is $\delta$-far from any codeword agreeing with $\text{Ans}$ on $S$

4. **Distance Preservation**
   - If $f$ is $\delta$-far from any codeword $u \in \text{RS}[F,L,d]$ with $u(x_j) = y_j$ for all $j$, then $q$ is $\delta$-far from $\text{RS}[F,L,d-|S|]$
   - This crucial property enables unbounded accumulation

The protocol achieves soundness error $2^{-\lambda}$ when:
- Field size $|\mathbb{F}| \geq 2^\lambda \cdot 10^7 \cdot d_{max}^3 \cdot \rho^{-3.5}$
- Distance parameter $\delta \in (0, 1 - 1.05\sqrt{\rho} - \frac{\lambda}{-\log(1-\delta)\cdot|L|})$
- Query parameter $t = \frac{\lambda}{-\log(1-\delta)}$

#### Efficiency Characteristics

The protocol achieves essentially optimal parameters:
- Verifier makes $\frac{2\lambda}{\log(1/\rho)}$ Merkle tree openings
- Under common list-decoding conjectures, this reduces to $\frac{\lambda}{\log(1/\rho)}$
- Prover computation requires $O(|L| \cdot |c_f| + d_{max}\log d_{max})$ field operations
- All costs are independent of accumulation depth

This construction enables efficient, unbounded accumulation while maintaining optimal parameters relative to the code rate, representing a significant advance over prior bounded-depth constructions.


## Applications and Future Directions

The unbounded hash-based accumulation scheme introduced by ARC opens up several exciting possibilities across different domains of cryptography and distributed systems.

### Zero-Knowledge Proof Systems

ARC's ability to work with Reed-Solomon codes makes it particularly valuable for IOP-based SNARKs. Most modern SNARK systems use Reed-Solomon encodings as a core building block, and ARC's efficient accumulation scheme can be directly integrated into these systems. This could enable new proof systems that combine the efficiency of IOPs with unbounded recursion, without relying on expensive elliptic curve operations.

A particularly promising application is in systems like STIR that already use Reed-Solomon proximity testing. ARC could replace their low-degree testing components with accumulation, potentially leading to more efficient recursive proofs. This would be especially valuable in scenarios requiring deep recursion, such as blockchain light clients or long-running computation verification.

### Blockchain and Consensus Systems

ARC's unbounded accumulation depth makes it particularly well-suited for blockchain applications. Current systems like Mina that use proof-carrying data for blockchain compression could benefit from ARC's efficiency improvements. The ability to accumulate an unlimited number of proofs without degradation could enable new approaches to blockchain compression and verification.

Moreover, ARC's hash-based nature provides better quantum resistance compared to discrete-log based schemes, making it a candidate for post-quantum secure blockchain systems. This could be particularly relevant as quantum computing advances threaten current cryptographic assumptions.

### Distributed Systems 

The scheme's ability to efficiently combine multiple proofs while preserving their properties suggests applications in distributed computation verification. For example:

- Distributed MapReduce computations could use ARC to accumulate proof fragments from different workers
- Cloud computing platforms could provide verifiable computation guarantees by accumulating proofs of individual computation steps
- Microservice architectures could implement end-to-end verification by accumulating proofs across service boundaries

The development of ARC represents not just a technical advancement in accumulation schemes, but potentially a new direction in the design of cryptographic protocols. Its unique combination of unbounded depth, optimal efficiency, and post-quantum security opens up possibilities that were previously impractical or impossible.

## References

1. Bünz, B., Mishra, P., Nguyen, W., & Wang, W. (2024). ARC: Accumulation for Reed--Solomon Codes. *Cryptology ePrint Archive, Paper 2024/1731*.

2. Chiesa, A., Chiesa, A., Fenzi, G., & Yogev, E. (2024). STIR: Reed-Solomon Proximity Testing with Fewer Queries. *Proceedings of the 44th Annual International Cryptology Conference (CRYPTO '24)*, 380-413.

3. Bünz, B., Chiesa, A., Lin, W., Mishra, P., & Spooner, N. (2021). Proof-Carrying Data Without Succinct Arguments. *Proceedings of the 41st Annual International Cryptology Conference (CRYPTO '21)*, 681-710.

4. Bünz, B., Mishra, P., Nguyen, W., & Wang, W. (2024). Accumulation without Homomorphism. *Cryptology ePrint Archive, Report 2024/474*.

5. Ben-Sasson, E., Goldberg, L., Kopparty, S., & Saraf, S. (2020). DEEP-FRI: Sampling Outside the Box Improves Soundness. *Proceedings of the 11th Innovations in Theoretical Computer Science Conference (ITCS '20)*, 5:1-5:32.

6. Ben-Sasson, E., Carmon, D., Ishai, Y., Kopparty, S., & Saraf, S. (2023). Proximity Gaps for Reed-Solomon Codes. *Journal of the ACM, 70*(5), 31:1-31:57.

7. Kothapalli, A., & Setty, S. T. V. (2024). HyperNova: Recursive Arguments for Customizable Constraint Systems. *Proceedings of the 44th Annual International Cryptology Conference (CRYPTO '24)*, 345-379.

8. Kothapalli, A., Setty, S. T. V., & Tzialla, I. (2022). Nova: Recursive Zero-Knowledge Arguments from Folding Schemes. *Proceedings of the 42nd Annual International Cryptology Conference (CRYPTO '22)*, 359-388.
