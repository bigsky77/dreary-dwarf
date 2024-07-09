---
title: "Proximity Is What You Want (1/5)"
description: "This post is purely for testing if the css is correct for the title on the page"
publishDate: "19 June 2024"
tags: ["low-degree testing", "IOP"]
---

# Proximity Is What You Want: *Low-Degree Testing for Reed-Solomon Codes*

*Thanks to Giacomo Fenzi for helpful review and feedback.*
*Full HackMD note can be found [here](https://hackmd.io/IUO7OMrKSQu5Zoigwb6kWQ?view#STIR-proof-of-proximity)*

Reed-Solomon(RS) codes are an important tool within computer science.  The deep history of these codes covers over fifty years of real-world applications.  In many ways, they are the fundamental building block for how data is stored and transferred in the digital era.

RS-codes remain an extremely active and rich area of research in the field of theoretic computer science. The most exciting new area of research is within the context of zero-knowledge cryptography and interactive oracle proofs(IOP).  Many of the properties that make RS-codes useful for working with data, also translate to the construction of efficient proof systems.

One of these properties is the concept of **proximity testing**.  Given a codeword $RS[\mathbb{F}, L, d]$ and a function $f:L \rightarrow \mathbb{F}$, we can determine whether $f$ is a code-word or $\delta$-close to a code-word by querying $f$ at only a few locations. Specifically, we test a proximity to a low-degree polynomial $p$ with respect to $L$: 

$$
\Delta(f,p) \le \delta
$$ 

This property is extremely useful when building proof systems with low query-complexity.

This note is an outcome of my learning from a close study of the following papers [ACY23], [ACFY24], [BCIKS20], [VIT], [H22] and [ASZ]. Unless otherwise specified, all equations are derived from those sources.  For an in-depth review of error-correcting codes [Gur04] is an invaluable resource.

We provide a high-level overview of the core tools used in building proximity tests and demonstrates several applications in the context of Interactive Oracle Proofs of Proximity (IOPP). 

:::info
For the purpose of this note, we focus exclusively on Interactive Oracle Proofs of Proximity (IOPP) and ignore Poly-IOPs.
:::

## Notation and Definitions

Assume the size of the domain $|L|$ and degree $d$ are both powers of two.  And that $L$ is a smooth multiplicative subgroup of the finite-field $\mathbb{F}$.

We define an **Error-Correcting Code** as:

**Definition 1.0.** *An error-correcting code of length $n$ over an alphabet $\Sigma$ is a subset $C \subseteq \Sigma^n$.  The code is linear if $\Sigma = \mathbb{F}$ is a field and $C$ is a subspace of $\mathbb{F}^n$*.

Definitions for **Reed-Solomon Codes**:

**Definition 1.1.** *The Reed-Solomon code over field $\mathbb{F}$, evaluation domain $L ⊆ \mathbb{F}$, and degree $d ∈ N$ is the set of evaluations over $L$ of univariate polynomials (over $\mathbb{F}$) of degree less than $d$*

When referring to polynomials and code-words we use the following definitions:

1) We define the rate of $RS[\mathbb{F}, L, d]$ as $\rho = {d\over|L|}$.
2) We use $\hat{f} \in \mathbb{F}^{<d}[X]$ to refer to the nearest polynomial to $f$ on $L$. 

The **Schwartz–Zippel Lemma** is fundamental to various IOPPs and used extensively.

**Lemma 1.2.** *For any non-zero polynomial $\hat{f} := \mathbb{F}^{<d}[X]$ it holds that $Pr_{\alpha \leftarrow \mathbb{F}}[\hat{p}(\alpha) = 0] \le {d  \over |\mathbb{F}|}$*

The **Random-Oracle Model**(ROM) is used extensively in almost all interactive proof systems.  Informally we define the ROM as:

**Definition 1.3.** *For $\sigma \in \mathbb{N}$, we denote $\mathcal{U}(\sigma)$ as the uniform distribution of all function $f$ of the form $f:\{0,1\}^* \rightarrow \{0,1\}^{\sigma}$. Or if $f$ is sampled uniformly from $\mathcal{U}(\sigma)$ then every output is a random $\sigma$-bit string.*   

## What is Proximity?

The basic idea behind proximity testing is that for some set $A \subset \mathbb{F}$ and some code $V := RS[\mathbb{F},L,d]$ either all the members of the set are $\delta$-close to $V$, or **nearly** all members of the set are far from $V$.  There is no case where half of $A$ is close and half is far.

A good definition for proximity in the context of Reed-Solomon codes comes from [BCIKS20].

**Definition 1.1**(Proximity Gaps):  *Let $P \subset \Sigma^n$ be a property, and $C \subset 2^{\Sigma^n}$ be a collection of sets.  Let $\Delta$ be a distance measure on $\sigma^n$.  We say that $C$ displays a $(\delta, \epsilon)$-proximity gap with respect to $P$ under $\Delta$ if every $S \in C$ satisfies exactly one of the following.*

1. $Pr_{s\in S}[\Delta (s, P) \le \delta] = 1$
2. $Pr_{s \in S}[\Delta (s, P) \le \delta] \le \epsilon$

In this case $\delta$ is called the **proximity parameter**, and $\epsilon$ the **error parameter**.

We measure proximity using the fractional Hamming distance, defined as:

$$\delta(f,p) = {1 \over |L|} \cdot |\{x \in L:f(x) \ne p(x)\}|$$

Because we know that all members of a set are either $\delta$-close to a code-word, or *nearly* all members are far from a code-word,  we only need to test a few members of a set know with a high degree of certainty whether the set is close to a codeword.

##  Interactive Oracle Proofs of Proximity(IOPP)

*Interactive Oracle Proofs* are a subset of proof systems that combine elements of interactive proofs and probabilistic proofs. An IOP of Proximity(IOPP) as described here, seeks to prove proximity to a polynomial of low-degree via a structured *public-coin* interaction between a prover and a verifier.

We assume the IOP interaction occurs over $k$-rounds, and the relation we seek to prove is defined as $\mathcal{R} =\{(\mathbb{x},\mathbb{y}, \mathbb{w})\}$. The prover receives $(\mathbb{x}, \mathbb{y}, \mathbb{w})$ as input, and the verifier receives $\mathbb{x}$ and oracle access to $\mathbb{y}$.  For every round $i \in [k]$, the verifier sends a random message $\alpha_i$ to the prover.  In return, the prover sends a proof string $\pi_i$ to the verifier.  At the end of the protocol, the verifier makes some queries to $\mathbb{y}$ and the proof string $\pi_1,...,\pi_k$ and outputs the final decision.

For an IOPP with a relation $\mathcal{R} =\{(\mathbb{x},\mathbb{w})\}$ and a tuple of two interactive algorithms $IOP = (P,V)$ in which $P$ is an interactive algorithm and $V$ is an interactive oracle algorithm,  we test the proximity of code $\mathcal{C} := RS[\mathbb{F}, L, d]$ given the pair $(\mathbb{x},\mathbb{w})$ where $\mathbb{x}$ is the code parameters and $\mathbb{w} \in \mathcal{C}$ is a codeword. We test for:

* **Completeness**: For every $(\mathbb{x}, \mathbb{w}) \in \mathbb{R}$
 
    $$
    {Pr \atop p_1,..,p_k}  \left[ V^{w, \pi_1,..,\pi_k}(\mathbb{x}, p_1,..,p_k) = 1  \; \Bigg| \;  \begin{align} \; \pi_1 \leftarrow P(\mathbb{x}, \mathbb{w}) \\... \\ \pi_k \leftarrow P(\mathbb{x}, \mathbb{w}, p_1,..,p_k ) \end{align}  \right] = 1
    $$

* **Proximity** For every $(\mathbb{x}, \mathbb{w})$ pair where $\mathbb{w}$ is $δ$-far in relative Hamming distance from any $\mathbb{w}'$ where $(\mathbb{x},\mathbb{w}) ∈ \mathbb{R}$ and any unbounded malicious prover $\tilde{P}$

    $$
    {Pr \atop p_1,..,p_k}  \left[ V^{\mathbb{w}, \pi_1,..,\pi_k}(\mathbb{x}, p_1,..,p_k) = 1  \; \Bigg| \;  \begin{align} \; \pi_1 \leftarrow \tilde{P}(\mathbb{x}, \mathbb{w}) \\... \\ \pi_k \leftarrow \tilde{P}(\mathbb{x}, \mathbb{w}) \end{align}  \right] \le \mathbb{B}(\delta)
    $$

### REF

[ACFY24] Gal Arnon, Alessandro Chiesa, Giacomo Fenzi, and Eylon Yogev. "STIR: Reed–Solomon proximity testing with fewer queries". *Cryptology ePrint Archive*, Report 2024/390. 2024. [https://eprint.iacr.org/2024/390](https://eprint.iacr.org/2024/390)

[BCIKS20] Eli Ben-Sasson, Dan Carmon, Yuval Ishai, Swastik Kopparty, and Shubhangi Saraf. "Proximity gaps for Reed-Solomon codes". In *Proceedings of the 61st Annual Symposium on Foundations of Computer Science (FOCS 2020)*, 2020. [https://eprint.iacr.org/2020/654](https://eprint.iacr.org/2020/654)

[BGKS20] Eli Ben-Sasson, Lior Goldberg, Swastik Kopparty, and Shubhangi Saraf. "DEEP-FRI: Sampling Outside the Box Improves Soundness". In: *Proceedings of the 11th Innovations in Theoretical Computer Science Conference (ITCS 2020)*. 2020, 5:1–5:32. [https://eprint.iacr.org/2019/336.pdf](https://eprint.iacr.org/2019/336.pdf)

[BBHR18b] Eli Ben-Sasson, Iddo Bentov, Ynon Horesh, and Michael Riabzev. "Fast Reed-Solomon Interactive Oracle Proofs of Proximity". In *Proceedings of the 45th International Colloquium on Automata, Languages, and Programming (ICALP 2018)*, 2018. [https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf](https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf)
