---
title: "Tools for Reed-Solomon Codes (2/5)"
description: "post is purely for testing if the css is correct for the title on the page"
publishDate: "21 June 2024"
tags: ["low-degree testing"]
---

# Tools for Reed-Solomon Codes 

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

### REF

[ACFY24] Gal Arnon, Alessandro Chiesa, Giacomo Fenzi, and Eylon Yogev. "STIR: Reed–Solomon proximity testing with fewer queries". *Cryptology ePrint Archive*, Report 2024/390. 2024. [https://eprint.iacr.org/2024/390](https://eprint.iacr.org/2024/390)

[H22] Ulrich Haböck. "A summary on the FRI low degree test". *Cryptology ePrint Archive*, Report 2022/1216. 2022. [https://eprint.iacr.org/2022/1216.pdf](https://eprint.iacr.org/2022/1216.pdf)
