---
title: "Proximity Is What You Want"
description: "This post is purely for testing if the css is correct for the title on the page"
publishDate: "19 June 2024"
tags: ["low-degree testing"]
---

# Proximity Is What You Want: *Low-Degree Testing for Reed-Solomon Codes*

*Thanks to Giacomo Fenzi for helpful review and feedback.*

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


## Tools for Reed-Solomon Codes 

At the heart of low-degree testing are a few basic tools and concepts which enable us to transform a code $f$ or list of codes $f_i$ into a low-degree polynomial $p$ and test proximity to the original code. Taken as a whole these tools represent the fundamental mathematical building blocks for working with RS-codes.    

### Correlated Agreement

This theorem states that if many random linear combination of two or more functions are $\delta$-close to a Reed-Solomon code-word then the original function must be a code-word.  Specifically, we want to know whether following holds true:

$$ 
\delta(f_0 + \lambda \cdot f_1, RS[\mathbb{F}, L, d]) \le \theta
$$

The theorem is laid out in full in the [BSCI20] and stated as follows.

**Theorem 1** *For $RS[\mathbb{F}, L, d]$ with rate $p = {k \over |L|}$.  Given the proximity parameter $\theta \in (0, 1 - \sqrt{p})$ and words $f_0,...,f_{d-i} \in \mathbb{F}^{d}$ for which*

$$ {|\{\lambda \in \mathbb{F}: \delta(f_0 + \lambda \cdot f_1 + ...+\lambda^{d-1}\cdot f_{d-1}, RS[\mathbb{F}, L, d] \le \theta\}|\over |\mathbb{F}|} > \epsilon$$

*where $\epsilon$ is the error-bounds.  There exists polynomials $p_0(X),...,p_{d-1}(X)$ belonging to $RS[\mathbb{F}, L, d]$ and set $A \subseteq L$ of density ${|A| \over |L|} \ge 1 - \theta$ on which $f_0,...,f_{d-1}$ coincide with $p_0,...,p_{d-1}$.  Specifically:* 

$$ 
\delta(f_0 + \lambda \cdot f_1+...+\lambda^{d-1}\cdot f_{d-1}, RS[\mathbb{F}, L, d]) \le \theta
$$

*for every value of $\lambda \in \mathbb{F}$.*

Correlated Agreement is extremely useful for building reduction arguments. Say we have a list of code-words $f_0,...,f_i$ and a code $V := RS[\mathbb{F}, L,d]$ and would like to verify that they are all close to $V$.  Correlated agreement enables us to take a random linear combination of $f_i$ and prove its proximity to $V$. If $f_i$ is close to $V$ then all the members of $f_i$ must also be close to $V$.  

Correlated agreement will power our next technique polynomial folding, and also enable us to efficiently batch polynomials.

:::info
See appendix for how we derive the soundness error bound $\epsilon$, this derivation is closely linked to the specific decoding regime used.
:::

### Polynomial Folding

At the heart of protocols like FRI and STIR, is a reduction operation in which a polynomial of size $d$ is step-wise reduced via random folding a polynomial of size $d/k$ using a folding parameter $k$. To achieve this, we "wrap" the polynomial around a random folding challenge $\alpha$-supplied by the verifier.  This preserves the function's proximity to the Reed-Solomon code while reducing the degree.

First we give two important facts for a polynomial $\hat{q} \in \mathbb{F}[X]$:

**Fact 1.** *For every $\hat{f} \in \mathbb{F}[X]$ there exists a unique bivariate polynomial $\hat{Q} \in \mathbb{F}[X, Y]$ with $deg_X(\hat{Q}) = [deg(\hat{f})/deg(\hat{q})]$ and $deg_Y(\hat{Q}) < deg(\hat{q})$ so that $\hat{f}(Z) = \hat{Q}(\hat{q}(Z), Z)$.*

Note: *$\hat{Q}$ can be computed efficiently given $\hat{f}$ and $\hat{q}$.  Observe, if $deg(\hat{f}) < t \cdot deg(\hat{q})$ then $deg_X(\hat{Q}) < t$.*

**Fact 2.** *For every $\hat{Q} \in \mathbb{F}[X, Y]$ with $deg_X(\hat{Q}) < t$ and $deg_Y(\hat{Q}) < deg(\hat{q})$, the polynomial $\hat{f}(Z):= \hat{Q}(\hat{q}(Z), Z)$ has degree $deg(\hat{f}) < t \cdot deg(\hat{q})$.*


We define the folding of a polynomial as:

**Definition 1.2.** *Given a polynomial $\hat{f} \in \mathbb{F}^{<d}$[X], a folding factor $k \in \mathbb{N}$, and a folding challenge $\alpha \in \mathbb{F}$, we define the polynomial $PolyFold(\hat{f}, k, r) \in \mathbb{F}^{<d/k}[X]$ as follows. Let $\hat{Q} \in \mathbb{F}[X,Y]$ be the bivariate polynomial derived from $\hat{f}$ with $\hat{q}(X) := X^k$. Then we define **PolyFold** as:*

$$PolyFold(\hat{f}, k, \alpha)(X) := \hat{Q}(X, \alpha)$$

And we define the folding of a function as:

**Definition 1.3.** *Let $f:L \rightarrow \mathbb{F}$ be a function, a folding factor $k \in \mathbb{N}$, and a folding challenge $\alpha \in \mathbb{F}$.  For every $x \in L^k$, let $\hat{p_x} \in \mathbb{F}^{<k}[X]$ be the polynomial where $\hat{p_x}(y) = f(y)$ for every $y \in L$ such that $y^k =x$. We then define **Fold** as*

$$Fold(f, k, \alpha)(x) := \hat{p_x}(\alpha)$$

*We compute $Fold(f, k, \alpha)(x)$ by interpolating the $k$ values $\{f(y):y\in L \;s.t. \;y^k =x\}$ into the polynomial $\hat{p}_x$ and evaluate this polynomial at $\alpha$.*

Now let's look a little more closely at the mechanics of folding a polynomial.

First we take a polynomial $\hat{f}(X) \in F^d[X]$, and we split it into even and odd terms. Assuming $d = 2$.

$$f(X) = f_O(X^{2}) + X \cdot f_E(X^{2})$$

Thus for $f_O$ and $f_E$, we have:

*   $f_O(X^2)= {f(X) - f(-X) \over 2X}$ 
*   $f_E(X^2)= {f(X) + f(-X) \over 2}$

Our goal is then to derive a new polynomial $$f^*(X) = f_O(X) + \alpha \cdot f_E(X)$$

from $f(X)$ assuming $\alpha$ is a random value provided by the verifier.


$$f^*(Y)= f_O(Y) + \alpha \cdot f_E(Y)$$

First we reduce our domain from $L_0$ to $L_1$ so that $L_1 \subseteq L_0$, and then we evaluate both $f_O$ and $f_E$ on the reduced domain i.e. $[f_E(y)|_{y \in L_1}]$ and $[f_O(y)|_{y \in L_1}]$ multiply by $\alpha$ and perform a Langrange Interpolation to derive $f^*$ which is then evaluated on the reduced domain and sent to the verifier as $[f^*(y)|_{y \in L_1}]$.


### Out-of-Domain Sampling

One of our primary goals when designing any IOP is to reduce *query complexity*, we want to make queries from the verifier easy and cheap. One way to do this is to work in list-decoding, where instead of working with a single correct output we instead work with a list of outputs, one of which is correct.  However, now the codeword sent by the prover doesn't have a single unique closest code-word.  This gives the prover lots of power. To solve this, we allow the verifier to send a random *out-of-domain*(OOD) sample $x \in \mathbb{F} \backslash L$ which forces the prover to choose one of the close polynomials.  Thus increasing soundness.

In practice, whenever the prover wishes to show that for function $f_i$ there exists two points $(x_i,y_i)$ which has at least one polynomial $\hat{f}_i$ which is close to $f_i$ and where $\hat{f}_i(x_i)=y_i$.  Instead of sending $f_i$ the prover sends $f_i:L \rightarrow \mathbb{F}$ where $\hat{f}_i$ is the evalution over $L$.  The verifier then samples a random field element $x_i \leftarrow \mathbb{F}$ and the prover responds with the following evaluation $y_i := \hat{f}_i(x_i)$.


:::info
Generally FRI does not use out-of-domain sampling in the main protocol and instead "pushes" this sampling to the arithmetization level.  See the DEEP-ALI paper for how this is done in practice.
:::

### Combining Functions of Varying Degree

In each round of the IOPP, the verifier queries a quotiented function and tests for low degree.  Because this is the most computationally expensive part of the protocol we would like to only run this test once.  Because of correlated agreement we know that we can produce a random linear combination of the functions $f_1,..,f_i$ and test those.  However, we run into a problem when the functions being tested are of different degrees.

To overcome this problem, we can combine functions of varying degrees using geometric sums. 

**Fact.1.0** *Let $\mathbb{F}$ be a field, $r \in \mathbb{F}$ be a field element, and $a \in \mathbb{N}$ be a natural number.*

$$
\sum_{i=0}^{a} r^i  = \left\{ \begin{array}{rcl}
({1 - r^{a+1}\over 1 -r}) & \mbox{for}
& r \neq 1 \\ a + 1 & \mbox{for} & r = 1 
\end{array}\right.
$$

Assuming a proximity error bounded by $min\{1-B^*(p), 1 - p - 1 / |L|\}$.

**Definition.1.1** *Given target degree $d\in \mathbb{N}$, shifting parameters $r$, functions $f_1,..,f_m:L \rightarrow \mathbb{F}$ and degrees $0 \le d_1,..,d_M \le d^*$ we define $Combine(d^*, r, (f_1, d_1),..,(f_M, d_M)):L \rightarrow \mathbb{F}$ as:*

$$Combine(d^*, r, (f_1, d_1),..,(f_M, d_M)(x) := \sum_{i=1}^{m} r_i \cdot f_i(x) \cdot (\sum_{\ell=0}^{d^*-d_i}(r \cdot x)^\ell )$$

Note: If we only want to correct degree then we can use $$DegCord(d^*, r, f, d) = Combine(d^*, r, (f, d))$$


### Quotienting

Quotienting is a method of enforcing constraints on a function . Roughly, if the polynomial corresponding to the RS-code does not satisfy the constraints, then the resulting quotient will be far from low-degree, which can then be detected by a low-degree test.

Because the verifier has query access to all $\hat{f}_i$ on the field $\mathbb{F}$, we need some constraints to enforce consistency and ensure that queries are limited to $L$, while only have access to evaluations of $f$ on $L$.  Without these constraints, the prover would have to send the evaluation of $f$ on the entire field $\mathbb{F}$, which would result in an enormous proof size. 

We formally define Quotienting as:

**Definition 1.4.** *For function $f:L \rightarrow \mathbb{F}$, set $S \subseteq \mathbb{F}$, and functions $Ans, Fill:S \rightarrow \mathbb{F}$, let $\hat{Ans} \in \mathbb{F}^{<|S|}[X]$ be the polynomial with $\hat{Ans}(x) = Ans(x)$ for every $x \in S$, and let $\hat{V}_S \in \mathbb{F}^{<|S|}[X]$ be the unique non-zero polynomial with $\hat{V}_S(x) =0$ for every $x \in S$.*

The **quotient** function $Quotient(f, S, Ans, Fill): L \rightarrow \mathbb{F}$ is defined as:

$$
\forall x \in L, Quotient(f,S, Ans, Fill)(x):=\left\{ \begin{array}{rcl}
Fill(x) & \mbox{for}
& x \in S \\ f(x) - \hat{Ans}(x)\over{\hat{V_S(x)}} & \mbox{for} & x \in \mathbb{F} \backslash S
\end{array}\right.
$$

**Definition 1.5.** *For polynomial $\hat{f} \in \mathbb{F}^{<d}[X]$ and set $S \subseteq F$, let $\hat{V_S} \in \mathbb{F}^{<|S|}[X]$ be the unique non-zero polynomial with $\hat{V_S}(x) = 0$ for every $x \in S$.*

*The **polynomial quotient** $PolyQuotient(\hat{f}, S) \in \mathbb{F}^{<d-|S|}[X]$ is defined as:*

$PolyQuotient(\hat{f}, S)(X)
:= {\hat{f}(X) - \hat{Ans}(X)\over{\hat{V_S}{X}}}$

*Where $\hat{Ans} \in \mathbb{F}^{<|S|}[X]$ is the unique non-zero polynomial with $\hat{Ans}(X) = Ans(x)$ for every $x \in S$.*

## FRI proof of proximity

The core idea of FRI is that we can prove that a function $f$ corresponds to a polynomial $p$ of low-degree with respect to $L$.

FRI is a IOPP consisting of several rounds of interaction between a prover and verifier. Given  a domain evaluation oracle $[f(x)|_{x\in L}]$ , we prove the $f$ is close to a code-word. 

$$
\delta(f,RS[\mathbb{F}, L, d]) \le \theta
$$

### Commit Phase
 
   During this phase, the prover sends a domain evaluation oracle to the verifier who responds with random challenges. After each round the prover performs a random reduction, halving the instance size.
   
   We start with a polynomial $f_0(X)=f(X)$ and its domain evaluation $L_0=L$. 
   
   Given a domain evaluation $[f_0(x)|_{x\in L_0}]$ for a polynomial $f_0(X) \in \mathbb{F}[X]$, $deg \; f_0(X)<k_0$ the commit phase runs through $r$ rounds.
   
   For each round $i$ in $1 \le i \le r$ the prover decomposes (*split and fold*) the previous polynomial.
   
   **Split** 

*    First we split the polynomial $f$ into even and odd terms.  $f_{i-1}(X) = f_E(X^2) + X \cdot f_O(X^2)$
*    Sample a random field element provided by the verifier $\alpha$
*    Derive random linear combination $f_i(X)=f_E(X)+\alpha \cdot f_O(X)$ from the codeword $f_{i-1}(X)$

**Fold**

* Let $\langle w \rangle$ be the generator for subgroup $\langle w \rangle = L \subset \mathbb{F}_p/{0}$
* Let the codeword for evaluation of $f_i$ on $L_i$ be $[f_i(y)|_{y \in L_i}]$
* Let $L^*=\langle w^2 \rangle$ be the domain of half the length
* Let the codewords for $f_E(Y)$, $f_O(Y)$, and $f^*(Y)$
    * $[f_E(y^{2i})|_{y \in L_i}]$
    * $[f_O(y^{2i})|_{y \in L_i}]$
    * $[f^*(y^{2i})|_{y \in L_i}]$
    
The above codewords enable us to calculate $f_i(Y) = f_E(Y) + \alpha \cdot f_O(Y)$ for each iteration.  Which is then committed to by sending the Merkle-Root to the verifier. 

### Query Phase
   
   At the start of the protocol the verifier receives a domain evaluation(commitment)  $[f_0(x)|_{x\in L_0}]$ for the target polynomial $f_0(X) \in F[X]$. 
   
   With each follow-on round $i$ in the protocol the verfier receives a commitment domain evaluation $[f_i(y)|_{y\in L_i}]$ to the reduced polynomial $f_i(Y) \in F[Y]$. 
   
   Finally, at the end of the protocol the verifier receives the full low-degree polynomial $f_r(X) \in F[X]$

   The query phase consists of $s\ge1$ rounds, first the verifier randomly samples $x_0 \in L_0$ and then recursively calculates $x_1,...,x_r$ via $x_i = \pi_i(x_{i-1})$ and checks:
   
   $$f_i(x_i) = FFT_{\alpha_i/x_i}(f_{i-1}(x_{i-1}),f_{i-1}(\tau \cdot x_{i-1}),..,f_{i-1}(\tau^{a_{i-1}} \cdot x_{i-1})$$
   
   for every $i = 1,..,r$ by quering the values of $p_{i-1}$ over the coset $x_{i-1} \cdot ker \; \pi_i$
   
## STIR proof of proximity 

STIR introduces a number of improvements to the protocol described above. Specifically, STIR progressively lowers the code rate, which reduces the number of verifier queries and makes testing easier. Because the rate is lowered after each round, each iteration requires fewer queries. This leads to reduced hash-complexity and fewer authentication paths.

Each STIR iteration reduces both the rate and the size of the evaluation domain.  A key difference to note, is while FRI reduces both domain and degree the difference remains constant, while in STIR the domain is reduced by a constant $c$ and the rate by $k$.

### Protocol Overview

Our goal is to reduce the testing of a function $f$ from $RS[\mathbb{F}, L, d]$ to $f'$ $RS[\mathbb{F}, L', d/k]$, where $k$ is the folding factor, $L'$ is the shifted domain, and $t$ is the testing parameter. 

**Note**: Assume 
* $L := \langle w \rangle$
* $L' := w \cdot \langle w^2 \rangle$

Each iteration of STIR consists of:

1) *Sample folding randomness*
* **V:** Samples and sends $r^{fold} \leftarrow \mathbb{F}$
2) *Send folded function*
* **P:** sends $g:L' \rightarrow \mathbb{F}$
    * $g$ is the evaluation of the polynomial $\hat{g}$ over $L'$
    * $\hat{g}$ is the extension of $Fold(f, r^{fold})$ to a polynomial of degree less than $d/k$
3) *Out-of-Domain Sample*
* **V:** sends $r^{out} \leftarrow \mathbb{F} \backslash L$
4) *Out-of-Domain Reply*
* **P:** sends $\beta \in \mathbb{F}$, in the honest case $\beta := \hat{g}(r^{out})$
4) *Shift queries*
* **V:** For every $i \in [t]$, sample $r^{shift}_i \leftarrow \langle w^k \rangle$
* **V:** Obtain $y_i := f_{r^{fold}}(r^{shift}_i)$ by querying the **virtual oracle** $f_{r^{fold}}$ where $f_{r^{fold}} := Fold(f, r^{fold})$

Finally, the next function $f'$ is defined as $f' := Quotient(g, \mathcal{G},p)$, where $\mathcal{G} := \{r^{out}, r^{shift}_1,...,r^{shift}_t\}$ and $p$ is the function $p:\mathcal{G} \rightarrow \mathbb{F}$ where $p(r^{out})= \beta$ and $p(r^{shift}_i) =y_i$.  

**Note:** that the verifier has virtual oracle access to $f'$ through it's oracle access to $g$.


### Shifted Domains

For each iteration in STIR we reduce the size of the domain by a constant factor $c := {|L| \over |L^*|}$ (in the paper $c=2$ which leads to linear proof length, but this isn't needed and $c$ can even be $c<1$). 

The domain $L := \langle w \rangle$ is shifted  to $L' := w \cdot \langle w^2 \rangle$.

Since $k$ is even, and $L’$ only contains odd powers of $w$, this guarantees that $L' \cap L^k$.  We can easily visualize this relation as: $$L^k = \langle w^k \rangle = \langle w^k, w^{2k},... \rangle$$ $$L' = w \cdot \langle w^2 \rangle = \langle w, w^3, w^5,... \rangle$$

The shift which ensures that $L'$ is disjoint from $L^k$ improves query complexity and reduces proof length. 

### Code Rate

The big idea behind RS-codes(and error-correcting codes) in general, is that we want to encode a message into a longer, redundant string which we call a code-word.  Because, this code-word needs to be transmitted and decoded over a noisy channel, we need redundancy to ensure the original message doesn't get lost.  We measure this redundancy via the code *rate*, which is the ratio of size of the message to the size of the code-word.

Intuitively the rate of a RS-code describes the codes density.   Thus, a lower rate makes testing easier.  The two main drivers for reducing rate in the protocol are the size of the $L^*$ domain and the size of the folding factor $k$.  

* A larger domain $L^*$ reduces the rate and number of queries in the next round, but also increases prover costs because the size of the FFT domain is larger.    
* A larger $k$ drives down the rate and the polynomial degree faster. However, this increases verifier costs because the verifier needs to compute larger folds. 

For STIR, assuming an initial rate $p := {d \over |L|}$, folding parameter $k$, and an evaluation domain $L^*$, we finding the new rate for each round by setting $c := {|L| \over |L^*|}$, and calculating the new rate as $p^* := ({c \over k}) \cdot p$. 

### Virtual Functions

Throughout the protocol, the verifier sometimes has oracle access to a function $f$ but wants to query a different (but related) function $f'$.  For example, in the following equation $f'(x) = f(x) + 5$ the verifier would first query $f(x)$ at the desired value, and then add 5 to the result.   

### STIR Setup

**Ingredients**

* a Field $\mathbb{F}$
* an iteration count $M \in \mathbb{N}$
* an initial degree parameter $d$ that is a power of 2
* folding parameters $k_0,...,k_m \in \mathbb{N}$
* evaluation domains $L_0,...,L_m \subseteq \mathbb{F}$ 
* repetition parameters $t_0,...,t_m \in \mathbb{N}$
* out of domain repetition parameters $s \in \mathbb{N}$

### STIR Prover

* **Initial Function:**

    **P:** Let $f_0:L_0 \rightarrow \mathbb{F}$ be an oracle functions, let $f_0 \in RS[\mathbb{F}, L, d]$, and let the prover have access to the polynomial $\hat{f}_0 \in \mathbb{F}^{<d_0}[X]$ 
    
* **Initial Folding:**

    **V**: $r^{fold}_0 \leftarrow \mathbb{F}$

* **Interaction phase loop:** for $i=1,...M$

    1) **Send folded function:**
        * **P:** sends function $g_i:L_i \rightarrow \mathbb{F}$
        * Where $g_i$ is domain evaluation of $\hat{g}_i := PolyFold(\hat{f}_{i-1}, k_{i-1}, r^{fold}_{i-1})$ 
    3) **Out-of-Domain Samples:**
        * **V:** sends $r^{out}_{i,1},...,r^{out}_{i,s} \leftarrow \mathbb{F} \backslash L_i$
    5) **Out-of-Domain Replies:**
        * **P:** sends $\mathcal{B}_{i,1},...,\mathcal{B}_{i,s} \in \mathbb{F}$
        * Where $\mathcal{B}_{i,j}$ is the evaluation of $\hat{g}_i(r^{out}_{i,j})$
    7) **STIR Messages:**
        * **V:** sends $r^{fold}_i, r^{comb}_i \leftarrow \mathbb{F}$
        * **V:** sends $r^{shift}_{i,1},...,r^{shift}_{i,t-1} \leftarrow \mathbb{F}$
   9) **Define next polynomial and send hole fills:**
       * **P:** define $\mathcal{G}_i
:= \{r^{out}_{i,1},...,r^{out}_{i,s},r^{shift}_{i,1},...,r^{shift}_{i,t-1}\}$ 
        * **P:** define $\hat{g}_i' := PolyQuotient(g_i, \mathcal{G}_i)$
        * **P:** define $Fill(r^{shift}_{i,j}) := \hat{g}_i'(r^{shift}_{i,j})$
        * **P:** send oracle messages $Fill_i\{r^{shift}_{i,1},...,r^{shift}_{i,t-1}\} \cap L_i \rightarrow \mathbb{F}$
        * **P:** define degree corrected polynomial $\hat{f}_i \in \mathbb{F}^{<d_i}[X]$ as $\hat{f}_i
:= DegCor(d_i, r^{comb}_i, \hat{g}_i', d_i - |\mathcal{G_i}|)$
        * Proceeed to next round with $\hat{f}_i$
 * **Final round**
     * Calculate $\hat{p} := Fold(\hat{f}_M, k_M, r^{fold}_m)$
     * Send $d_M$ coeffiecents of  $\hat{p}$ to **V**


### STIR Verifier

* **Loop:** For $i=1,..,M$

    1. For every $j \in [t_{i-1}]$ query $Fold(f_{i-1}, k_{i-1}, r^{fold}_{i-1})$ at $r^{shift}_{i,j}$
    2. Define $\mathcal{G}_i
:= \{r^{out}_{i,1},...,r^{out}_{i,s},r^{shift}_{i,1},...,r^{shift}_{i,t-1}\}$ 
    * These are the values we know placed into a set
    * Let $Ans_i:\mathcal{G}_i \rightarrow \mathbb{F}$ be the function where:
        * $Ans_i(r^{out}_{i,j})=\mathcal{B_{i,j}}$
        * $Ans_i(r^{shift}_{i,j}) = Fold(f_{i-1}, k_{i-1}, r^{fold}_{i-1})(r^{shift}_{i,j})$
    * Set $\hat{g}_i' := Quotient(g_i, \mathcal{G}_i, Ans_i, Fill_i)$
    3. Define virtual oracle $f_i:L \rightarrow \mathbb{F}$ as: 
     * $f_i := DegCor(d_i, r^{comb}_i, \hat{g}_i', d_i - |\mathcal{G}_i|)$

* **Consistency with final polynomial:**

    1. Sample random points $r^{fin}_1,..,r^{fin}_{t_m} \leftarrow L_M$
    2. Check that $\hat{p}(r^{fin}_j)=Fold(f_M, k_M, r^{fold}_M)$ for every $j \in [t_M]$

* **Consistency with Ans:**

    1. For every $i \in \{1,..,M \}$ and every $x \in \mathcal{G}_i \cap L_i$ query $g_i(x)$ and check that $g_i(x)=Ans_i(x)$


## Ref

[ACY23] Gal Arnon, Alessandro Chiesa, and Eylon Yogev. "IOPs with Inverse Polynomial Soundness Error". In: *64th IEEE Annual Symposium on Foundations of Computer Science (FOCS 2023)*, Santa Cruz, CA, USA, November 6-9, 2023. IEEE, 2023, pp. 752–761. [https://eprint.iacr.org/2023/1062.pdf](https://eprint.iacr.org/2023/1062.pdf)

[ACFY24] Gal Arnon, Alessandro Chiesa, Giacomo Fenzi, and Eylon Yogev. "STIR: Reed–Solomon proximity testing with fewer queries". *Cryptology ePrint Archive*, Report 2024/390. 2024. [https://eprint.iacr.org/2024/390](https://eprint.iacr.org/2024/390)

[BCIKS20] Eli Ben-Sasson, Dan Carmon, Yuval Ishai, Swastik Kopparty, and Shubhangi Saraf. "Proximity gaps for Reed-Solomon codes". In *Proceedings of the 61st Annual Symposium on Foundations of Computer Science (FOCS 2020)*, 2020. [https://eprint.iacr.org/2020/654](https://eprint.iacr.org/2020/654)

[BGKS20] Eli Ben-Sasson, Lior Goldberg, Swastik Kopparty, and Shubhangi Saraf. "DEEP-FRI: Sampling Outside the Box Improves Soundness". In: *Proceedings of the 11th Innovations in Theoretical Computer Science Conference (ITCS 2020)*. 2020, 5:1–5:32. [https://eprint.iacr.org/2019/336.pdf](https://eprint.iacr.org/2019/336.pdf)

[BBHR18b] Eli Ben-Sasson, Iddo Bentov, Ynon Horesh, and Michael Riabzev. "Fast Reed-Solomon Interactive Oracle Proofs of Proximity". In *Proceedings of the 45th International Colloquium on Automata, Languages, and Programming (ICALP 2018)*, 2018. [https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf](https://drops.dagstuhl.de/storage/00lipics/lipics-vol107-icalp2018/LIPIcs.ICALP.2018.14/LIPIcs.ICALP.2018.14.pdf)

[Gur07] Venkatesan Guruswami. "Algorithmic results in list decoding". In *Foundations and Trends in Theoretical Computer Science*, volume 2(2), 2007. [https://www.cs.cmu.edu/~venkatg/pubs/papers/listdecoding-NOW.pdf](https://www.cs.cmu.edu/~venkatg/pubs/papers/listdecoding-NOW.pdf)

[Gur04] Venkatesan Guruswami. "List decoding of error-correcting codes". In *Lecture Notes in Computer Science*, no. 3282, Springer, 2004. [https://www.cs.cmu.edu/~venkatg/pubs/papers/frozen.pdf](https://www.cs.cmu.edu/~venkatg/pubs/papers/frozen.pdf)

[H22] Ulrich Haböck. "A summary on the FRI low degree test". *Cryptology ePrint Archive*, Report 2022/1216. 2022. [https://eprint.iacr.org/2022/1216.pdf](https://eprint.iacr.org/2022/1216.pdf)

[VIT] Vitalik Buterin. "STARKs, part 2: Thank goodness for FRI". Vitalik's blog, 2017. [https://vitalik.eth.limo/general/2017/11/22/starks_part_2.html](https://vitalik.eth.limo/general/2017/11/22/starks_part_2.html)

[ASZ] Alan Szepieniec. "Anatomy of STARKs: FRI". 2020. [https://aszepieniec.github.io/stark-anatomy/fri](https://aszepieniec.github.io/stark-anatomy/fri)

[FEN] Giacomo Fenzi. "STIR Parameters". Giacomo Fenzi's blog, 2024. [https://gfenzi.io/blurbs/stir-parameters/](https://gfenzi.io/blurbs/stir-parameters/)

## Appendix

In this appendix we provide a short background on key coding theory concepts such as list-decoding and error-bounds.  When working with error-correcting codes, we seek to balance the trade-offs between our coding *data rate*(the amount of non-redundant information in our code) and the *error rate*(the fraction of symbols that can be corrupted and still allow message recovery).  

List-decoding seeks to find the optimal solution for these trade-offs by outputting a list of close code-words(one of which is correct), instead of a single code-word.  

See [Gur07] and [Gur04] for an depth exploration of list-decoding. 

#### List Decoding

Say we have two messages $m_1$ and $m_2$ which we encode using $E(m_1)$.  Assuming a minimum distance $d$,  we transmit this message and the channel distorts the message with $d/2$-errors which distorts $E(m_1)$ into $r$ which is exactly in between $E(m_1)$ and $E(m_2)$.  Now we have no way of determining whether $m_1$ or $m_2$ is the correct message. 

**Theorem 1.0:** *For the code $C := RS[\mathbb{F}, L, d]$, parameters $\delta \in [0,1]$, and $f:L \rightarrow \mathbb{F}$.  We define $List(f, d, \delta)$ as the list of code-words in $C$ with at most $\delta$ relative Hamming distance from $f$.  Such that $C$ is $(\delta, \mathcal{l})$-list decodable if $List(f, d, \delta) \le \mathcal{l}$ for every $f$.*

#### Johnson Bound

**Theorem 1.1:** *The code $RS[\mathbb{F}, L, d]$ is $(1 - \sqrt{p} - \eta, {1 \over 2\eta\sqrt{p} })$-list **decodable** for every $\eta \in (0, 1 - \sqrt{p})$ where $p := {d \over |L|}$ is the rate of the code.* 

#### Error Bounds

We define the function $err^*(d, p, \delta, m)$ for both unique and list decoding as follows:

1) Unique decoding regime $\delta \in (0, {1-p \over 2})$:

$$err^*(d, p, \delta, m) := {(m - 1) \cdot d \over p \cdot \mathbb{F}}$$

2) List decoding regime $\delta \in ({1-p \over 2}, 1 - \sqrt{p})$:

$$err^*(d, p, \delta, m) := {(m - 1) \cdot d^2 \over \mathbb{F}\cdot (2 \cdot min\{1 - \sqrt{p} - \delta, {\sqrt{p} \over 20} \}) }$$

#### Decoding Algorithms (WIP)

##### Berlekamp-Welch 

##### Sudan

##### Guruswami-Sudan
