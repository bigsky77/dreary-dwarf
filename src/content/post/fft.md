---
title: "A (somewhat) gentle introduction to the FFT"
description: "fft"
publishDate: "12 July 2024"
tags: ["fft", "algorithms"]
draft: false 
---

## Introduction

For a function $f:L \rightarrow \mathbb{F}$, the Fast Fourier Transform(FFT) enables us to interpolate and evaluate $f$ over the smooth-multiplicative sub-group $L$.

This simple sounding operation underlies a vast number of modern computer algorithms.  In fact, the FFT is one of the cornerstone mathematical tools upon which the digital world is built. FFTs are vital for encoding and decoding error-correcting codes, where the primary operations often involve *evaluating* a polynomial at some set of points, and then *interpolating* the result back after some transformation.

## Definitions 

### Groups

A Fourier transform group $L$ is a set of elements $\{e^{2\pi i k/N} \mid k = 0, 1, \ldots, N-1\}$ under multiplication, satisfying:

$$
e^{2\pi i m/N} \cdot e^{2\pi i n/N} = e^{2\pi i (m+n)/N}
$$

for $ m, n \in \{0, 1, \ldots, N-1\}$.


### Polynomials

We define a univeriate polynomial as $p(X)=a_o + a_1X + a_2(X^2) + ... + a_{d-1}X^{d-1}$, where $d \in \mathbb{N}$.

polynomials can be evaluated.  Given a $d$ number of points $x_1,..,x_d$, we can represent the polynomial $P(X)$ as a vector $\vec{v} = \langle y_1, ..., y_d \rangle$.  Here $y_i =P(x_i)$ which is the evaluation of $P(X)$ on $x_i$.

Polynomials can either be represented in *coefficient* form or *evaluation* form. When we wish to represent a polynomial in evaluation form for the domain $L$ we write $[p_{0}(x)|_{{x \in L_{0}}}] $.

Most of the time when working with polynomials, we will be working with polynomials over a field.  The central theorem for polynomials over a field is this:

**Theorem:** *Any non-trivial polynomial over a field of degree at most $d$ has at most $d$ roots*.

**Definitions:**
- A *non-trivial polynomial* is a polynomial that is not identically zero.
- A *root* of a polynomial $P(x)$ is a value $x$ such that $P(x) = 0$.

### Roots of Unity

For an element $g \in \mathbb{F}$, if $g^d = 1$ then we say that $g$ is the $d$-th root of unity.  If $g^1,..g^d$ generates $d$ distinct elements then we call $g$ the *primitive root of unity*.

### Master Theorem

The Master Theorem helps in analyzing the recursive time complexity of divide-and-conquer algorithms like the Fast Fourier Transform. 

Given an algorithm $T(n)$ where $n$ is the input size, we denote the runtime of the algorithm by the following relation:

$$
T(n) = aT({n \over b}) + f(n)
$$

Here $f(n)$ is the time to create the subproblems, ${n \over b}$ is the size of each subproblem, and $a$ is the number of child nodes. 

#### Applying the Master Theorem:

For a recurrence of the form: $ T(n) = aT\left(\frac{n}{b}\right) + f(n)$ 

Where, 
- $ a = 2$
- $ b = 2 $
- $ f(n) = O(n) $

Compare $f(n)$ against $ n^{\log_b a} $:

- $\log_b a = \log_2 2 = 1 $
- $f(n) = O(n) = O(n^{\log_b a})$

According to the Master Theorem, if $f(n) = O(n^{\log_b a})$, then the recurrence $T(n) = O(n^{\log_b a} \log n)$.

Thus, for FFT:
$T(n) = O(n \log n)$

This illustrates why the FFT is efficient, with a complexity of $O(n \log n)$ compared to a naive $O(n^2)$ approach.

## Polynomial Isomorphism

One of the most powerful results in modern computer science is Shamir's **Secret Sharing Scheme**, which enables a secret to be split and shared across a number of parties.  Understanding the intuition behind this scheme helps explain why polynomial evaluations and interpolations are such a vital part of modern zero-knowledge proofs.

Central to this scheme is the concept of polynomial isomorphism.

Polynomial isomorphism is a bijective polynomial homomorphism $\psi : R[x] \to S[y]$ between the polynomial rings $R[x]$ and $S[y]$ that also has an inverse $\psi^{-1} : S[y] \to R[x]$ such that:

1. **Addition**: $\psi(f(x) + g(x)) = \psi(f(x)) + \psi(g(x))$
2. **Multiplication**: $\psi(f(x) \cdot g(x)) = \psi(f(x)) \cdot \psi(g(x))$
3. **Identity**: $\psi(1) = 1$
4. **Bijectivity**: There exists an inverse $\psi^{-1}$ satisfying $\psi\circ\psi^{-1} = \text{id}_{S[y]}$ and $\psi^{-1}\circ\psi = \text{id}_{R[x]}$

where $f(x), g(x) \in R[x]$.

Here are the steps we use to conduct the Secret Sharing Scheme.

1. **Polynomial Construction**:
   - A secret $S$ is represented as the constant term of a polynomial $P(x)$ of degree $t-1$ over a finite field $\mathbb{F}_q$.
   - The polynomial $P(x)$ has the form:
     $$ 
     P(x) = a_0 + a_1 x + a_2 x^2 + \cdots + a_{t-1} x^{t-1}
     $$ 
     where $a_0$ is the secret $S$, and $a_1, a_2, \ldots, a_{t-1}$ are random coefficients from $\mathbb{F}_q$.

2. **Creating Shares**:
   - Shares are created by evaluating $P(x)$ at distinct points $x_i$ in $ \mathbb{F}_q $.
   - Each share is a pair $(x_i, P(x_i))$.

3. **Secret Reconstruction**:
   - To reconstruct the secret $S$, at least $t$ shares $(x_1, P(x_1)), (x_2, P(x_2)), \ldots, (x_t, P(x_t))$ are required.
   - Use Lagrange interpolation to find the polynomial $P(x)$ that fits these points.
   - The Lagrange interpolation polynomial $P(x)$ is given by:
     $$
     P(x) = \sum_{j=1}^{t} P(x_j) \prod_{\substack{1 \le k \le t \\ k \neq j}} \frac{x - x_k}{x_j - x_k}
     $$
   - The secret $S$ is the constant term of this polynomial, i.e., $S = P(0)$.


Here we can see how shares are obtained by evaluating the polynomial $P(x)$ at distinct points.  FFTs can efficiently evaluate polynomials at multiple points. This is particularly useful if the points are roots of unity in a finite field, where the FFT complexity $ O(n \log n)$ significantly improves over naive $O(n^2)$ evaluation.

On the other hand, recovering the secret $S$ from shares involves polynomial interpolation. The Inverse FFT (IFFT) can efficiently compute polynomial interpolation by transforming frequency domain evaluations into time domain coefficients.

We will see this same principle applied again and again in zero knowledge cryptography.

## Theorem

Given a polynomial $p(x)$ of $d = \mathbb{N}$, assuming $d$ is a power of 2, we use a divide and conquer algorithm to recursivley split the polynomial.

$$
p(X) = p_e(X^2) + x \cdot p_o(X^2)
$$

Where $p_e$ and $p_o$ are polynomials composed of the even and odd coefficients of $p$ of degree at most $d/2 -1$. 

$$
p_e(X)=a_o + a_2X + a_4(X^2) + ... + a_{d-1}X^{d/2-1}
$$

$$
p_o(X)=a_1 + a_3X + a_5(X^2) + ... + a_{d-1}X^{d/2-1}
$$

Here we run into a problem, for our algorithm we want to compute all $d$ evaluations of both $p_e$ and $p_o$ , not just $d/2$ evaluations.  To solve this problem, we will use the primitive root of unity of our domain.

Because there is a two-to-one correspondence within our domain( $x$ and $-x$ are both part of our domain  ),  $x$ and $-x$ will always have the same square.   

Now observe that:

$$
p(X) = p_e(X^2) + X \cdot p_o(X^2)
$$

$$
p(-X) = p_e(X^2) - X \cdot p_o(X^2)
$$

This means that when we repeat the $d/2$ evaluations of the $d/2$ root a second time we arrive at all the $d$ evaluations of squares for the $d$ roots.  By recursivley evaluating half the domain of a cyclic group, we end up evaluating all the values of the group!

## Radix-2 Algorithm

Radix-2 is a divide and conquer algorithm that breaks each problem into progressively smaller subproblems.  The two main methods for defining the subproblems are called Decimation in Time(DIT) and Decimation in Frequency(DIF).

### Decimation in Time(DIT)

In DIT, the idea is to decouple the polynomial into its even and odd indexed terms:

$$
p(X) = p_e(X^2) + x \cdot p_o(X^2)
$$


- **$ p_e(X^2) $**: Contains the coefficients of the even-indexed terms of the original polynomial.
- **$ p_o(X^2) $**: Contains the coefficients of the odd-indexed terms of the original polynomial, scaled by $X$.

### Decimation in Frequency(DIF) 

In DIF, we split the polynomial differently—into sums of the first half and the second half after shifting terms:

$$
P(X) = P_{\text{even}}(X) + X \cdot P_{\text{odd}}(X)
$$

- **$ P_{\text{even}}(X) $**: Sum of terms from the first half of the polynomial.
- **$ P_{\text{odd}}(X) $**: Sum of terms from the second half of the polynomial, shifted by $( X )$.
$$
P(X) = (a_0 + a_1X) + (a_2 + a_3X)X + (a_4 + a_5X)X^2 + \ldots 
$$


### Implementation

Now let's see how this algorithm is actually implemented. Here we have two examples in pseudocode for both a DIF and DIT FFT.

Here the FFT is decimated in time.

```plaintext
function FFT_DIT(x, domain):
    n = length(x)
    if n <= 1:
        return x

    // Split x into even and odd parts (DIT)
    even = [x[2 * k] for k in 0 to n/2 - 1]
    odd = [x[2 * k + 1] for k in 0 to n/2 - 1]

    domain_reduced = domain[::2]

    // Recursively compute FFT of even and odd parts
    Feven = FFT_DIT(even, domain_reduced)
    Fodd = FFT_DIT(odd, domain_reduced)

    // Combine results
    combined = [0...n-1]
    for k = 0 to n/2 - 1:
        t = domain[k] * Fodd[k]
        combined[k] = Feven[k] + t
        combined[k + n/2] = Feven[k] - t

    return combined
```

And Here the FFT is decimated in time.

```plaintext
function FFT_DIF(x, domain):
    n = length(x)
    if n <= 1:
        return x

    // Combine step (DIF)
    for k = 0 to n/2 - 1:
        temp = x[k]
        x[k] = x[k] + x[k + n/2]
        x[k + n/2] = temp - x[k + n/2]

    domain_reduced = domain[::2]

    // Split the computation into two halves
    first_half = FFT_DIF(x[0 to n/2 - 1], domain_reduced)
    second_half = FFT_DIF(x[n/2...n-1], domain_reduced)

    // Combine the results
    for k = 0 to n/2 - 1:
        t = domain[k] * second_half[k]
        x[k] = first_half[k] + t
        x[k + n/2] = first_half[k] - t

    return x
```

## Bit-Reversal

When implementing the Radix-2 Algorithm, the area which seems to give people by far the most trouble is the idea of bit-reversal.  However, the idea itself it actually quite simple.  Bit reversal enables us to split the FFT input into even and odd parts without additional data shuffling during the computation.

This ensures that the structure of the computation follows the necessary order to achieve optimal complexity $O(n \log n$).

Here is an illustratration of how it works in practice.

### Visualization

#### Original Indices and Binary Representation:
```
Index:  0   1   2   3   4   5   6   7
Binary: 000 001 010 011 100 101 110 111
```

#### Bit-Reversed Indices:
Reverse the binary representation of each index:
```
Binary Reversed: 000 100 010 110 001 101 011 111
New Index:       0   4   2   6   1   5   3   7
```

#### Data Reordered According to Bit-Reversed Indices:
If original data points were `[x0, x1, x2, x3, x4, x5, x6, x7]`, after bit-reversal:
```
Bit-Reversed Data: [x0, x4, x2, x6, x1, x5, x3, x7]
```

### FFT Stages with Pre-Arranged Data:

#### Stage 1: Intermediate DFT of size 2:
```
Combine: [(x0, x4), (x2, x6), (x1, x5), (x3, x7)]
```

#### Stage 2: Intermediate DFT of size 4:
```
Combine: [(x0, x4, x2, x6), (x1, x5, x3, x7)]
```

#### Stage 3: Final DFT of size 8:
```
Combine: [(x0, x4, x2, x6, x1, x5, x3, x7)]
```

A key difference to note:

- **DIT**: Bit reversal is used before FFT computation to rearrange input data.
- **DIF**: Bit reversal is used after FFT computation to rearrange the final output.

## Reference

[SHA79]  Shamir, Adi. "How to Share a Secret." Communications of the ACM 22 , no. 11 (1979): 612-613. https://dl.acm.org/doi/pdf/10.1145/359168.359176

[CT65]  Cooley, James W. and John W. Tukey. “An algorithm for the machine calculation of complex Fourier series.” Mathematics of Computation 19 (1965): 297-301.

[CG00]  Eleanor Chu, and Alan George. "Inside the FFT Black Box: Serial and Parallel Fast Fourier Transform Algorithms." CRC Press (2000). https://dsp-book.narod.ru/FFTBB/0270_PDF_TOC.pdf

[A23] Ittai Abraham "The Fast Fourier Transform over finite fields" (2023) https://decentralizedthoughts.github.io/2023-09-01-FFT/

[V19]  Vitalik Buterin "Fast Fourier Transforms" (2019) https://vitalik.eth.limo/general/2019/05/12/fft.html
