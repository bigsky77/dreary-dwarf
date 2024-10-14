---
title: "Down the Rabbit-Hole: The Low-Degree Test"
description: "Low-Degree Testing "
publishDate: "10 October 2024"
tags: ["LowDegreeTest", "Property Testing", "TheoreticalComputerScience"]
draft: false 
---

*This work is supported by a grant from the Mina Foundation*

The Low-Degree Test(LDT) is a fundamental tool in theoretical computer science. We use the LDT to break down complex mathematic structures (multivariate polynomials) into simpler parts. These smaller components enable us to recursively infer information about complex global structures.  These tests appear again and again throughout zero-knowledge cryptography. 

This post draws from the Alessandro Chiesa's lecture slides[^1], Oded Goldreich's lecture notes[^2], and the *"Robust characterization of polynomials with applications to program testing"*[^3] paper where these techniques were first discussed.

## Preliminaries

First we recall the fundamental tool of property testing which is the linearity test. We define a test $V_{lin}$ for some function $\forall f:\mathbb{F_p}^n \to \mathbb{F_p}$ with the following guarantees:

- **Completeness**:
$$
f \in Lin[\mathbb{F_p},n] \to Pr[V_{Lin}^f=1] =1
$$

- **Soundness**:
$$
\triangle(f, Lin[\mathbb{F_p}, n]) \le \delta \to Pr[V_{Lin}^f=1] \le \delta(\epsilon)
$$

Low-degree testing adds one more constraint $Lin[\mathbb{F_p}, n, d]$ which is the total degree of the polynomial. We define low-degree as:

$$
LD[\mathbb{F_p}, n, d] = \{f:\mathbb{F_p}^n \to \mathbb{F_p} | \exists p \in \mathbb{F_p}[X_1,..,X_n] \ of \ deg(p) \le f \ s.t. \ p=f\}
$$

In the course of this post we will be working with two functions $f,g$ over the domain $D \to \mathbb{F_p}$. We define the distance between these two functions as the fraction of the points $x \in D$ where the two functions disagree:

$$
d(f,g) = \frac{|\{x\in D|f(x)\neq g(x)\}|}{|D|}
$$

## Univariate Polynomials

### First Approach

The primary focus of LDT is testing multivariate polynomials, however we will start with univariate polynomials and build our way up to more complex polynomials.

First we recall that a polynomial is defined by any $d+1$ locations in $\alpha_1, \alpha_2, \alpha_{d} \in \mathbb{F_p}$. The goal then becomes to define the following test:

$$
V_{Lin}^{f:\mathbb{F_p} \to \mathbb{F_p}}[\mathbb{F_p}, d] = 1
$$

The naive approach is to query the $f$-values $\alpha_1,...,\alpha_d$, interpolate them so that $\tilde{p}(x) := \{(\alpha_i, f(\alpha_i))\}_{i=1}^d$ and then check against a random point $r \in \mathbb{F_p}$ such that $\tilde{p}(r) = f(r)$.

The major problem with the naive approach is its impractical query complexity when extended to multivariate polynomials.

- In the naive approach, you query $f$ at $d$ points and then check at one additional random point $r$, totaling $d+1$ queries.

However, when dealing with multivariate polynomials this approach leads to an exponential number of queries. Recall that for a polynomial of $n$-variables $x_1, x_2, x_n$ of total degree $d$, each monomial is of the form $x_1^{k_1}, x_2^{k_2},..,x_n^{k_n}$ where $k$ is an integer such that $k_1 + k_2 +..+k_n \le d$.  

The total number of monomials is given using the multiset coefficient calculated using the Binomial Coefficient Formula, given as:

$$
\binom{!n}{!d} = \frac{!n}{!d(n-d)!}
$$

Which leads to a total query complexity

$$
\binom{n + d}{d} + 1
$$

Meaning query complexity grows exponentially with the size of $n$.

### Second Approach

With our first naive attempt out of the way, let's now illustrate a second approach. In this attempt we focus on the unique structure of polynomials over finite fields, such as their behavior under addition and multiplication, and the structure provided by field operations. 

In this approach, we look at the binomial coefficients and explore the concept of finite differences. For any polynomial we define the first finite difference as:

$$
\triangle f(\alpha)= f(\alpha+1) - f(\alpha)
$$

And then for the $n$-difference, we use:

$$
\triangle^n f(x) = \sum_{k=0}^n(-1)^{n+1}\binom{n}{k}f(x+k)
$$

Using this formula we can compute the finite difference up to any point $d+1$ where the finite difference $\triangle^{d+1}f(x)=0$.

$$
c_i := (-1)^{i+1}\binom{d+1}{i} \in \mathbb{F_p}
$$

Our goal then, is to evaluate $f$ in terms of the finite difference between each term. If this sums to 0 then $f$ is of low-degree. We are looking for: 
    
$$
\forall d < p \ \forall f:\mathbb{F_p} \to \mathbb{F_p} \ f \in \mathbb{F_p}^{\le d}[x] \leftrightarrow \forall{\alpha} \in \mathbb{F_p} \sum_{i=0}^{d+1} c_i \cdot f(\alpha+i)=0
$$

To see how this works, take for example a $d$-degree 0 polynomial:

$$
(c_0, c_1)=(-1,1) \to -f(\alpha) + f(\alpha+1)=0
$$

Compared to a $d$-degree 1 polynomial:

$$
(c_0, c_1, c_2)=(-1,2,-1) \to -f(\alpha) + 2f(\alpha+1) - f(\alpha+2)=0
$$

Now our verifier $V^{f:\mathbb{F_p} \to \mathbb{F_p}}$ proceeds with the following steps:

1. Sample $r \leftarrow \mathbb{F_p}$
2. Query $f$ at $r, r+1,.., r+(d+1)$
3. Check that $\sum_{i=0}^{d+1} c_i \cdot f(r+i)=0$

However, with this approach we still have a major problem. In this case our queries are spaced linearly instead of randomly, and for some cases this test will accept with either a very high probability or always. Especially when the field's characteristic $p$ is small or $p ≤ d$ — the coefficients $c_i$ in the test can become zero or behave unexpectedly, causing the test to fail.

### Third Approach

In our third and final approach, we are going to introduce one additional random field element $h \in \mathbb{F_p}$ which will ensure our test behaves correctly. We characterize this with the following approach. 

$$
\forall d < p \ \forall f:\mathbb{F_p} \to \mathbb{F_p} \ f \in \mathbb{F_p}^{\le d}[x] \leftrightarrow \forall{\alpha,h} \in \mathbb{F_p} \sum_{i=0}^{d+1} c_i \cdot f(\alpha+i \cdot h)=0
$$

Now, when the direction is $\leftarrow$ we set $h=1$ and invoke our original lemma. And when the direction is $\to$, we fix $\alpha,h \in \mathbb{F_p}$ and consider the case when $g(x) := f(\alpha x+h)$.

This adjustment effectively randomizes the input to $f$ along lines in the field, parameterized by $\alpha$ and $h$, which helps to overcome the limitations caused by the field's characteristic. By introducing $h$, the test evaluates $f$ not just along fixed increments (as in $+1,…\alpha,\alpha+1,…)$, but along any arithmetic progression in $\mathbb{F_p}$. Now our local constraints increase from $|\mathbb{F_p}|=p$ to $|\mathbb{F_p}|^2=p^2$.

This results in a total low-degree test with query complexity $O(d^3)$ independent of $n$, meaning that unlike the previous tests this test will extend to multivariate polynomials with no change.

## Multivariate Polynomials

Now that we have a good starting point with univariate polynomials, we will apply the same techniques to multivariate polynomials. Even though the type of polynomials used changes, our main equation only changes very slightly. We introduce a vector size $n$ and as well as variables $x_1,...,x_n$. 

$$
\forall d < p \ \forall f:\mathbb{F_p}^n \to \mathbb{F_p} \ f \in \mathbb{F_p}^{\le d}[x_1,..,x_n] \leftrightarrow \forall{\alpha,h} \in \mathbb{F_p}^n \sum_{i=0}^{d+1} c_i \cdot f(\alpha+i \cdot h)=0
$$

The test itself is also similar, for the verifier $V_{RS}^{f:\mathbb{F_p}^n \to \mathbb{F_p}}$, we run the following algorithm: 

1. Sample $r,s \leftarrow \mathbb{F_p}^n$
2. Query $f$ at $r,r+s,..,r+(d+1) \cdot s$ 
3. Check that $\sum_{i=0}^{d+1} c_i \cdot f(r + i \cdot s) =0$

And for soundness we get:

$$
\Pr[V_{RS}^f=0] \ge \min \{\frac{1}{4 \cdot (d+2)^2}, \frac{1}{2} \cdot \triangle(f, \mathbb{F_p}^{\le d}[x_1,..,x_n])\}
$$

## A Robust Characterization of Polynomial Functions

Now that we have established the basics, we are prepared to delve into the actual proof of the robust characterization of polynomial functions. The following lemmas and proofs are drawn directly from the original Rubinfeld and Sudan test[^3] and demonstrates that if a function passes a specific low-degree test with high probability, then it is close to a degree-$d$ polynomial.

### Proof Outline 

**Distance Bound:** Let $\delta_0 = \frac{1}{2(d+2)^2}$.

**Mapping:** Consider a function $P: \mathbb{F_p}^m \to \mathbb{F_p}$.

We define the error probability $\delta$ as:

$$
\delta = \Pr_{\alpha,h \in \mathbb{F_p}^m} \left[P(\alpha) \neq \sum_{i=1}^{d+1} c_i P(\alpha + i h)\right] \leq \delta_0,
$$

where $c_i \in \mathbb{F_p}$ are fixed coefficients, and the operations are performed in $\mathbb{F_p}$.

Our goal is to show that if this condition is satisfied, then there exists a degree-$d$ polynomial $g: \mathbb{F_p}^m \to \mathbb{F_p}$ that is $2\delta$-close to $P$, meaning they agree on at least $1 - 2\delta$ fraction of the inputs.

### Lemma 6

*If $\delta \leq \delta_0$, then there exists a degree-$d$ polynomial $g: \mathbb{F_p}^m \to \mathbb{F_p}$ such that $P$ and $g$ agree on more than $1 - 2\delta$ fraction of the inputs in $\mathbb{F_p}^m$.*

**Proof:**

Suppose, for contradiction, that $P$ is not $2\delta$-close to any degree-$d$ polynomial. This means that for every degree-$d$ polynomial $q$, we have:

$$
\Pr_{x \in \mathbb{F_p}^m}[P(x) \neq q(x)] > 2\delta.
$$

Let $E = \{ x \in \mathbb{F_p}^m \mid P(x) \neq q(x) \}$. Then, $|E| > 2\delta |\mathbb{F_p}^m|$.

Consider the probability that $P$ fails the test at a random $(\alpha, h)$:

$$
\Pr_{\alpha,h} \left[ P(\alpha) \neq \sum_{i=1}^{d+1} c_i P(\alpha + i h) \right] \geq \frac{|E|}{|\mathbb{F_p}^m|} \left( 1 - \left(1 - \frac{|E|}{|\mathbb{F_p}^m|}\right)^{d+1} \right).
$$

Since $|E| / |\mathbb{F_p}^m| > 2\delta$, this lower bounds the failure probability:

$$
\Pr_{\alpha,h} \left[ P(\alpha) \neq \sum_{i=1}^{d+1} c_i P(\alpha + i h) \right] > 2\delta \left(1 - (1 - 2\delta)^{d+1}\right).
$$

For small $\delta$, this expression exceeds $\delta$, contradicting the assumption that $\delta \leq \delta_0$. Therefore, there must exist a degree-$d$ polynomial $g$ such that:

$$
\Pr_{x \in \mathbb{F_p}^m}[P(x) = g(x)] \geq 1 - 2\delta.
$$

### Lemma 7

*For all $\alpha \in \mathbb{F_p}^m$,*

$$
\Pr_{h \in \mathbb{F_p}^m} \left[ g(\alpha) = \sum_{i=1}^{d+1} c_i P(\alpha + i h) \right] \geq 1 - 2(d+1)\delta.
$$

**Proof:**

Since $P$ and $g$ agree on at least $1 - 2\delta$ fraction of the inputs, the probability that $P(\alpha) \neq g(\alpha)$ is at most $2\delta$. Similarly, for each $i$, the probability that $P(\alpha + i h) \neq g(\alpha + i h)$ is at most $2\delta$.

For fixed $\alpha$, the probability over $h$ that any of the $P(\alpha + i h)$ differ from $g(\alpha + i h)$ is at most $(d+1) \times 2\delta = 2(d+1)\delta$.

Therefore, the probability that all $P(\alpha + i h) = g(\alpha + i h)$ for $i = 1, \ldots, d+1$ is at least $1 - 2(d+1)\delta$.

When $P(\alpha) = g(\alpha)$ and $P(\alpha + i h) = g(\alpha + i h)$ for all $i$, we have:

$$
g(\alpha) = P(\alpha) = \sum_{i=1}^{d+1} c_i P(\alpha + i h) = \sum_{i=1}^{d+1} c_i g(\alpha + i h).
$$

Therefore,

$$
\Pr_{h} \left[ g(\alpha) = \sum_{i=1}^{d+1} c_i P(\alpha + i h) \right] \geq 1 - 2(d+1)\delta.
$$

### Lemma 8

*For all $\alpha, h \in \mathbb{F_p}^m$, if $\delta \leq \frac{1}{2(d+2)^2}$, then*

$$
\sum_{i=0}^{d+1} c_i g(\alpha + i h) = 0.
$$

**Proof:**

From Lemma 7, for each fixed $\alpha$, the probability over $h$ that

$$
g(\alpha) = \sum_{i=1}^{d+1} c_i P(\alpha + i h)
$$

is at least $1 - 2(d+1)\delta$.

Similarly, since $P$ and $g$ agree on all but a $2\delta$ fraction of points, the probability over $h$ that $P(\alpha + i h) = g(\alpha + i h)$ for all $i$ is at least $1 - 2(d+1)\delta$.

Combining these, the probability that both $g(\alpha) = \sum_{i=1}^{d+1} c_i P(\alpha + i h)$ and $P(\alpha + i h) = g(\alpha + i h)$ for all $i$ is at least:

$$
1 - 4(d+1)\delta.
$$

Thus, the probability that

$$
g(\alpha) = \sum_{i=1}^{d+1} c_i g(\alpha + i h)
$$

is at least $1 - 4(d+1)\delta$.

Since $\delta \leq \frac{1}{2(d+2)^2}$, we have $4(d+1)\delta \leq \frac{2(d+1)}{(d+2)^2} < 1$, so the probability is positive.

Now, consider the polynomial:

$$
F(\alpha, h) = \sum_{i=0}^{d+1} c_i g(\alpha + i h).
$$

This is a polynomial in $\alpha$ and $h$ of degree at most $d$ in each variable. The set of $(\alpha, h)$ where $F(\alpha, h) \neq 0$ has measure less than 1, and since $\mathbb{F_p}$ is a finite field, a nonzero polynomial of total degree less than $p$ can vanish on at most a fraction proportional to its degree over $p$.

Given that $F(\alpha, h)$ vanishes on a positive fraction of $\mathbb{F_p}^m \times \mathbb{F_p}^m$, and $p$ is sufficiently large, it must be identically zero. Therefore,

$$
\sum_{i=0}^{d+1} c_i g(\alpha + i h) = 0 \quad \text{for all } \alpha, h \in \mathbb{F_p}^m.
$$

This equality implies that $g$ satisfies a specific linear recurrence relation, reinforcing that $g$ is indeed a degree-$d$ polynomial.

### Conclusion

By the above lemmas, we have shown that if $P$ passes the low-degree test with error probability $\delta \leq \delta_0$, then there exists a degree-$d$ polynomial $g$ such that $P$ and $g$ agree on at least $1 - 2\delta$ fraction of the inputs. Moreover, $g$ satisfies the recurrence relation $\sum_{i=0}^{d+1} c_i g(\alpha + i h) = 0$ for all $\alpha, h \in \mathbb{F_p}^m$, confirming its degree bound.

[^1]: A. Chiesa *Lecture Notes on Low Degree Tests*
[^2]: O. Goldreich *Lecture Notes on Low Degree Tests* 
[^3]: R. Rubinfeld and M. Sudan. *Robust characterization of polynomials with applications to program testing*. SIAM Journal on Computing, 25(2), pages 252–271, 1996.

