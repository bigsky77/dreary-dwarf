---
title: "Note on Foldable Codes"
description: "Short introduction to folding error correcting codes"
publishDate: "21 October 2024"
tags: ["cryptography", "error-correcting codes", "RAA codes", "polynomial commitment schemes", "zero-knowledge proofs", "code switching"]
draft: False 
---

*This work is supported by a grant from the Mina Foundation*

## Introduction 

Polynomial Commitment Schemes (PCS) are fundamental cryptographic primitives in zero-knowledge proofs, built either on elliptic curve cryptography (e.g., KZG construction) or on error-correcting codes with hash functions (e.g., FRI protocol). Elliptic curve-based PCS offer succinct proofs but are computationally intensive, while hash-based PCS are computationally lighter but result in larger proofs.

Given that PCS often bottleneck proof generation, there is significant interest in developing schemes that combine succinctness with prover efficiency. Multivariate polynomials, particularly multilinear ones where each variable has degree at most one, have become increasingly prominent. They enhance protocols like Spartan's sum-check by improving efficiency and enabling better parallel computation.

However, existing FRI-based PCS support only univariate polynomials, creating a gap with modern proof systems that utilize multivariate polynomials. Recent research focuses on extending the FRI protocol to accommodate multivariate polynomials by constructing efficiently foldable codes.[^3][^4][^7]

In this note, we explore various approaches to building such codes, addressing the challenges and potential solutions in adapting PCS to better serve contemporary proof systems.

## Preliminaries

### Polynomial Commitment Schemes

A polynomial commitment scheme consists of the following algorithms:

- Setup: Given a security parameter $\lambda$ and the number of variables $n \in \mathbb{N}$, output public parameters $pp$.

- Commit: Given an $n$-variate multilinear polynomial $f$ and $pp$, output a commitment $C$ and randomness $D$.

- Evaluate: Given $pp$, $f$, a point $a \in \mathbb{F}^n$, and $D$, output a proof $\pi$ that $f(a) = v$.

- Verify: Given $pp$, $C$, $a$, $v$, and $\pi$, output $b \in {0,1}$ indicating whether the proof is valid.

### Multilinear Extensions 

For any function $f: {0,1}^n \to \mathbb{F}$, there exists a unique multilinear polynomial $\tilde{f} \in \mathbb{F}[X_1, X_2, \dots, X_n]$ known as the multilinear extension of $f$. This polynomial satisfies $\tilde{f}(b) = f(b)$ for all $b \in {0,1}^n$, effectively extending the domain of $f$ from the Boolean hypercube to the entire field $\mathbb{F}^n$. Each variable $X_i$ in $\tilde{f}$ has degree at most one, ensuring that the polynomial remains multilinear.

### Linear Codes

A linear code over $\mathbb{F}$ is an injective linear mapping $E: \mathbb{F}^k \to \mathbb{F}^n$. The code $C = E(\mathbb{F}^k)$ is a $k$-dimensional subspace of $\mathbb{F}^n$ with minimum Hamming distance $d = \min_{c \ne c'} \operatorname{Ham}(c, c')$, where $c, c' \in C$ and $\operatorname{Ham}(c, c')$ denotes the Hamming distance between $c$ and $c'$.

### Correlated Agreement

The correlated agreement principle states that if a random linear combination of two vectors $x, y \in \mathbb{F}^n$ is $\delta$-close to a codeword in a linear code, then both $x$ and $y$ are individually $\delta$-close to some codewords, with discrepancies on the same coordinates.[^1]

Formally, let $\alpha \in \mathbb{F}$ be randomly chosen. If there exists a codeword $c \in C$ such that $\operatorname{Ham}(\alpha x + y, c) \le \delta n$, then there exist codewords $c_x, c_y \in C$ satisfying:

- $\operatorname{Ham}(x, c_x) \le \delta n$,
- $\operatorname{Ham}(y, c_y) \le \delta n$,

The sets ${i \mid x_i \ne (c_x)_i}$, ${i \mid y_i \ne (c_y)_i}$, and ${i \mid \alpha x_i + y_i \ne c_i}$ are equal.

## Foldable Codes

In the context of interactive oracle proofs (IOPs) and polynomial commitment schemes, **foldable codes** are linear error-correcting codes that support an operation called *folding*. Folding allows the prover to transform codewords or polynomial evaluations into a compressed form with reduced length or degree while preserving the code's structural properties essential for verification. A code is considered foldable if it enables such transformations without losing the ability to detect and correct errors.[^8]

Foldable linear codes use encoding algorithms denoted as: 

$$ 
\{ \text{Enc}_i: \mathbb{F}^{2^i} \to \mathbb{F}^{2^{i+1}} \}_{i=1}^d 
$$

where each encoding step transforms a message of size $ 2^i $ to one of size $ 2^{i+1} $. These codes are parameterized by vectors $ \{ \vec{t}_{i,L}, \vec{t}_{i,R} \in \mathbb{F}^{2^i} \} $ such that, for all $ i \in [d] $ and for each index $ j $, the vectors satisfy $ \vec{t}_{i,L}[j] \neq \vec{t}_{i,R}[j] $. This property ensures the linear independence of the vectors during the folding process.

The "foldability" of the code refers to the ability to combine two encoded halves (left and right) of the message into a single encoding by folding, as expressed by the equation:

$$
\text{Enc}_{i+1}(\vec{m}_L || \vec{m}_R) = \text{Enc}_i(\vec{m}_L) + \vec{t}_{i,L} \circ \text{Enc}_i(\vec{m}_R)
$$

This folding mechanism relies on the fact that the vectors $ \vec{t}_{i,L} $ and $ \vec{t}_{i,R} $ act as evaluation points, and the encodings of the left and right halves are composed based on their coefficient and evaluation forms. Examples of foldable codes include the well-known Reed-Solomon codes.

## BaseFold

BaseFold is a field-agnostic Polynomial Commitment Scheme that achieves $O(log^2(n))$ verifier costs and $O(n \ log \ n)$ prover time by generalizing the FRI protocol to work with any foldable linear code.[^2] 

The key innovation is demonstrating that random foldable codes maintain good relative minimum distance over any sufficiently large field, enabling efficient SNARKs that can work natively in any field without expensive field emulation. 

The following sections follow the excellent *"Basefold in the List Decoding Regime"*[^5] paper.

### Folding Protocol 

The first step in Basefold is to transform a multilinear polynomial $P \in F[X_1,...,X_n]$  into its univariant representation by evaluating over a boolean hypercube $H_n=\{0,1\}^n$.  

$$
p(X) = \sum_{i=0}^{2n-1} P(i_1,..,i_n) \cdot X^i
$$

With $i$ ranging from $0$ to $2^n - 1$, since there are $2^n$ points in the hypercube $H_n = \{0,1\}^n$. 

The commitment is calculated by evaluating the univariant polynomial $p(X)$ over an evaluation domain $D$.  We then split the univariant polynomial into odd and even parts(in the same manner as the FRI protocol).

$$
p(X) = p_O(X^2) + X \cdot p_E(X^2)
$$

Which generalizes too:

$$
p_{\lambda_1}(X) =(1 - \lambda_1) \cdot p_O(X) + \lambda_1 \cdot p_E(X)
$$

And concludes with the base case:

$$
v = P(\lambda_1,...,\lambda_n)
$$

Where $\lambda_1,...,\lambda_n$ are the verifier supplied randomness.

Essentially FRI-like folding results from partial evaluations of the multilinear extensions.

#### Interleaved sum-check and folding

Use multivariate sumcheck protocol to evaluate the final inner product.

$$
v = \langle L(\vec{w},.), P(.) \rangle_{H_n} = \sum_{\vec{x} \in H_n} L(\vec{w}, \vec{x}) \cdot P(\vec{x})
$$

The fundamental observation is that the **same** randomness $\lambda_1,...,\lambda_n$ used in the FRI folding rounds is used in the sumcheck protocol.

### BaseFold IOP 

#### Commit Phase

The prover computes sumcheck polynomials in each round:

$$ 
q_i(X) = \sum_{x \in H_{n-(i+1)}} L((\lambda_1, \dots, \lambda_i, X, x), \omega) \cdot P(\lambda_1, \dots, \lambda_i, X, x) 
$$

This polynomial aggregates evaluations over smaller hypercubes at each round $i$, determined by previously fixed challenges $\lambda_1, \dots, \lambda_i$ and the query point $\omega$.

Instead of sending sumcheck polynomials directly, the prover sends a linear polynomial:

$$ 
\Lambda_i(X) = \sum_{x \in H_{n-(i+1)}} L(x, (\omega_{i+2}, \dots, \omega_n)) \cdot P(\lambda_1, \dots, \lambda_i, X, x) 
$$

This simplifies the prover's work by sending a linear polynomial $\Lambda_i(X)$, which the verifier uses to reconstruct the sumcheck polynomials efficiently.

The sumcheck polynomial is derived from the linear polynomial:

$$ 
q_i(X) = L(\lambda_1, \dots, \lambda_i, \omega_1, \dots, \omega_i) \cdot L(X, \omega_{i+1}) \cdot \Lambda_i(X) 
$$

This equation connects the sumcheck polynomial $q_i(X)$ with the folding of Reed-Solomon codes, relating the folding to partial evaluations of the polynomial.

At the last step of the sumcheck protocol, the value of the polynomial $P$ at random point $\lambda = (\lambda_1, \dots, \lambda_n)$ is:

$$ 
v = P(\lambda_1, \dots, \lambda_n) 
$$

After all rounds, the protocol reduces to evaluating $P$ at a random point derived from the verifier's challenges.

#### Query Phase 

The verifier queries the committed polynomials $f_i$ to check consistency:

$$ 
f_{i+1}(x_{i+1}) = \frac{f_0(x_i) + f_0(-x_i)}{2} + \lambda_i \cdot \frac{f_0(x_i) - f_0(-x_i)}{2} \cdot x_i 
$$

This equation ensures consistency in folding at every round, verifying that the sumcheck and folding operations align.

[^1]: Ben-Sasson, E., Bentov, I., Horesh, Y., & Riabzev, M. (2017). Fast Reed-Solomon Interactive Oracle Proofs of Proximity. *Electron. Colloquium Comput. Complex*.
[^2]: Zeilberger, H., Chen, B., & Fisch, B. (2023). BaseFold: Efficient Field-Agnostic Polynomial Commitment Schemes from Foldable Codes. *Cryptology ePrint Archive, Paper 2023/1705*.
[^3]: Brehm, M., Chen, B., Fisch, B., Resch, N., Rothblum, R. D., & Zeilberger, H. (2024). Blaze: Fast SNARKs from Interleaved RAA Codes. *Cryptology ePrint Archive, Paper 2024/1609*.
[^4]: Guo, Y., Liu, X., Huang, K., Qu, W., Tao, T., & Zhang, J. (2024). DeepFold: Efficient Multilinear Polynomial Commitment from Reed-Solomon Code and Its Application to Zero-knowledge Proofs. *Cryptology ePrint Archive, Paper 2024/1595*.
[^5]: Haböck, U. (2024). Basefold in the List Decoding Regime. *Cryptology ePrint Archive, Paper 2024/1571*.
[^7]: Zhang, Z., Li, W., Guo, Y., Shi, K., Chow, S. S. M., Liu, X., & Dong, J. (2024). Fast RS-IOP Multivariate Polynomial Commitments and Verifiable Secret Sharing. *USENIX Security Symposium*.
[^8]: Chen, B. https://chancharles92.github.io/slides/BaseFold.pdf
