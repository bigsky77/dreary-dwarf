---
title: "Repeat-Accumulate-Accumulate (RAA) Codes "
description: "Essential mathematical formulas for understanding Repeat-Accumulate-Accumulate codes and lifting techniques in cryptography"
publishDate: "18 October 2024"
tags: ["cryptography", "error-correcting codes", "RAA codes", "polynomial commitment schemes", "zero-knowledge proofs", "lifting techniques"]
draft: false
---

## Introduction

Repeat-Accumulate-Accumulate (RAA) codes are a family of error-correcting codes that combine simplicity of encoding with powerful error-correction capabilities. These codes operate by repeating each input bit a fixed number of times, then applying two rounds of permutation and accumulation, resulting in a codeword that can be efficiently encoded and decoded. RAA codes have gained significant attention in cryptography, particularly in the development of efficient polynomial commitment schemes and zero-knowledge proofs, due to their favorable balance between encoding complexity and minimum distance properties.

This analysis is based on the work presented in the Blaze paper[^1].

## RAA Code Equations 

The Repeat-Accumulate-Accumulate (RAA) code is defined by an encoding process that combines repetition, permutation, and accumulation operations. This process can be expressed mathematically as:

$$
RAA_{\pi_1,\pi_2}(x) = A \cdot M_{\pi_2} \cdot A \cdot M_{\pi_1} \cdot F_r \cdot x
$$

where $A$ is the accumulator matrix, $M_{\pi_1}$ and $M_{\pi_2}$ are permutation matrices, and $F_r$ is the repetition operator.

A key aspect of analyzing RAA codes is understanding how the accumulator affects the weight of vectors. The probability that a random vector of weight $a$ is mapped to a vector of weight $b$ by the accumulator is given by:

$$
p_{a\mapsto b} := \Pr[\text{wt}(Ax) = b] = \binom{b-1}{\lceil a/2\rceil-1}\binom{n-b}{\lfloor a/2\rfloor} \bigg/ \binom{n}{a}
$$

This probability plays a crucial role in estimating the number of low-weight codewords in an RAA code.

To assess the performance of RAA codes, we consider the expected number of low-weight codewords. This expectation is expressed as:

$$
\sum_{w_2=n^\kappa+1}^{2d} \sum_{w_3=1}^d \binom{n/r}{w} \cdot \frac{\binom{rw}{rw_1/2}\binom{n-rw}{w_2-rw/2}}{\binom{n}{w_2}} \cdot \frac{\binom{w_2}{\lceil w_2/2\rceil}\binom{n-w_2}{w_3-\lceil w_2/2\rceil}}{\binom{n}{w_3}} \cdot \frac{rw_1/2 \cdot \lceil w_2/2\rceil}{w_2w_3}
$$

The analysis of this expectation leads to a bound on the number of low-weight codewords, which can be expressed as:

$$
O(n^{1+\gamma-r/2}) + 2^{-\Omega(n^\gamma)}
$$

This bound provides insight into the code's minimum distance properties and the probability of generating a "bad" code with poor distance. These mathematical formulations and analyses are essential for understanding the behavior and performance of RAA codes, particularly in terms of their error-correction capabilities and suitability for various applications in coding theory and cryptography.

## RAA Encoding

Repeat-Accumulate-Accumulate (RAA) codes are error-correcting codes defined by the following encoding process:

$$
RAA_{\pi_1,\pi_2}(x) = A \cdot M_{\pi_2} \cdot A \cdot M_{\pi_1} \cdot F_r \cdot x
$$

Where:
- $x$ is the input message
- $F_r$ repeats each input bit $r$ times
- $M_{\pi_1}$ and $M_{\pi_2}$ are permutation matrices
- $A$ is an accumulator matrix that computes prefix sums modulo 2

The encoding process follows these steps:
1. Repeat each input bit $r$ times ($F_r$)
2. Permute the repeated bits ($M_{\pi_1}$)
3. Accumulate (prefix sum modulo 2) ($A$)
4. Permute again ($M_{\pi_2}$)
5. Accumulate once more ($A$)

This process creates a codeword with good error-correction properties while maintaining efficient encoding and decoding. The rate of the code is 1/r, where r is the repetition factor.

```
Encoding process visualization:
x → F_r → M_π1 → A → M_π2 → A → RAA_π1,π2(x)
```

The strength of RAA codes lies in their balance between simplicity, encoding efficiency, and error-correction capability, making them valuable in cryptographic applications like polynomial commitment schemes.

```

A           M_π2        A           M_π1        F_r    x
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───┐ ┌─┐
│1        │ │1        │ │1        │ │    1    │ │1  │ │ │
│11       │ │ 1       │ │11       │ │      1  │ │1  │ │ │
│111      │ │  1      │ │111      │ │  1      │ │1  │ │ │
│1111     │ │   1     │ │1111     │ │1        │ │ 1 │ │ │
│11111    │ │    1    │ │11111    │ │       1 │ │1  │ │ │
│111111   │ │     1   │ │111111   │ │         │ │1  │ │ │
│1111111  │ │1        │ │1111111  │ │         │ │   │ │ │
│11111111 │ │ 1       │ │11111111 │ │         │ │   │ │ │
└─────────┘ └─────────┘ └─────────┘ └─────────┘ └───┘ └─┘
```

The RAA code encoding process involves a series of matrix operations applied to the input vector $x$. The process starts with repeating each input bit, followed by two rounds of permutation and accumulation, resulting in the final codeword $RAA_{\pi_1,\pi_2}(x)$.


## Critical Points and Distance Analysis

The analysis of RAA codes relies on studying the function $f$ which describes
the distance properties of the RAA codes:

$$
f(\alpha, \beta, \rho) := \frac{H(\alpha)}{r} - H(\beta) - H(\rho) + \alpha + (1-\alpha)H\left(\frac{\beta - \alpha/2}{1 - \alpha}\right) + \beta + (1-\beta)H\left(\frac{\rho - \beta/2}{1 - \beta}\right)
$$

Where $H$ is the binary entropy function, $\alpha = rw_1/n$, $\beta = w_2/n$, and $\rho = w_3/n$ represent relative weights at different stages of the encoding process.

Critical points of $f$ are found by solving:

$$\frac{\partial f}{\partial \alpha} = 0 \Leftrightarrow \beta = \frac{1}{2} \pm \frac{1-\alpha}{2}\sqrt{1-\left(\frac{\alpha}{1-\alpha}\right)^{2/r}}$$

$$\frac{\partial f}{\partial \beta} = 0 \Leftrightarrow \delta = \frac{1}{2} \pm \frac{1-\beta}{2}\sqrt{1-\left(\frac{1-\beta}{\beta}\right)\left(\frac{\beta-\alpha/2}{1-\beta-\alpha/2}\right)^2}$$

The maximum value of $f$ over admissible $(\alpha,\beta,\rho)$ determines the achievable rate-distance tradeoff. For a target distance $\delta$, we require $\max f(\alpha,\beta,\delta) < 0$ over the admissible region.

## Puncturing

For punctured RAA codes, we analyze:

$$F(\alpha, \beta, \rho, \rho') = f(\alpha, \beta, \rho) + \phi(\rho, \rho')$$

Where $\phi(\rho, \rho')$ accounts for the puncturing process. Critical points satisfy:

$$\rho' = \frac{\rho(c+1) - 1/2}{1+c}$$
where $c = \frac{(1-\rho)^2(\rho-\beta/2)}{\rho^2(1-\rho-\beta/2)}$

Puncturing allows achieving new rate-distance tradeoffs while maintaining similar failure probabilities to the original RAA codes. The analysis aims to maximize $F$ subject to constraints on the relative weights $\alpha$, $\beta$, $\rho$, and $\rho'$.

This framework enables a detailed study of the distance properties and puncturing behavior of RAA codes, providing bounds on achievable parameters and failure probabilities.

## Lifting Technique Equations

The interleaved code $C^t$ is derived from a base code $C$ and is defined as a mapping:

$$
C^t: F^{t \times k} \rightarrow F^{t \times n}
$$

This construction plays a crucial role in the lifting process, which is used to improve the efficiency of the code.

In the lifting process, we consider a probability bound for the interleaved code:

$$
\Pr[r^T \cdot (c - u \otimes C(1_k)) \in \text{Lin}_{z_2}] > \delta'
$$

This bound relates to the likelihood of a certain linear combination falling within a specific linear space.

After lifting the code, we can bound the failure probability using the following expression:

$$
\frac{\Pr[E_{>w}]}{\Pr[\neg \tilde{E}_{\leq w}]} + \frac{\Pr[E_{\leq w} \wedge \neg \tilde{E}_{\leq w}]}{\Pr[\neg \tilde{E}_{\leq w}]}
$$

This bound helps us understand the likelihood of the lifted code failing to meet certain criteria.

There's an important relationship between the distances of the original and lifted codes:

$$
\Delta(c - u \otimes C(1_k), (Lin_{z_2})^t) > \delta
$$

This inequality shows how the distance properties are preserved or altered in the lifting process.

Finally, we have a probability bound for the lifted code in terms of an affine space:

$$
\Pr[r^T c \in \text{Aff}'_{z_2,\langle u,r \rangle}] > \delta'
$$

This bound is crucial for understanding the behavior of the lifted code with respect to certain affine spaces.

These equations collectively describe key properties and relationships in the
process of code interleaving and lifting, which are important techniques for
improving the efficiency and performance of error-correcting codes in various
applications.

[^1]: Martijn Brehm, Binyi Chen, Ben Fisch, Nicolas Resch, Ron D. Rothblum, and Hadas Zeilberger. "Blaze: Fast SNARKs from Interleaved RAA Codes." Cryptology ePrint Archive, Paper 2024/1609, 2024. https://eprint.iacr.org/2024/1609
