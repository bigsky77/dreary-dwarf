---
title: "A (somewhat) gentle introduction to the FFT"
description: "This post is purely for testing if the css is correct for the title on the page"
publishDate: "10 July 2024"
tags: ["fft"]
draft: true
---

## Introduction

For a function $f:L \rightarrow \mathbb{F}$, the Fast Fourier Transform enables us to interpolate and evaluate $f$ over the smooth-multiplicative sub-group $L$.

## Background
### Polynomials
### Roots of Unity
### Master Theorem
## Polynomial Isomorphism

## Theorem
## Radix-2 Algorithm

```go
func fft(p []int, domain []int, modulus int) []int {
    if len(p) == 1 {
        return p
    }

    L := fft(sliceStep(p, 2), sliceStep(domain, 2), modulus)
    R := fft(sliceStep(p[1:], 2), sliceStep(domain, 2), modulus)

    o := make([]int, len(p))

    for i := range L {
        yTimesRoot := (R[i] * domain[i]) % modulus // Ensure multiplication under modulus
        o[i] = (L[i] + yTimesRoot) % modulus
        if o[i] < 0 {
            o[i] += modulus
        }
        o[i+len(L)] = (L[i] - yTimesRoot) % modulus
        if o[i+len(L)] < 0 {
            o[i+len(L)] += modulus
        }
    }

    return o

}
```

### Bit-Reversal
## Reference

[SHA]  Shamir, Adi. "How to Share a Secret." Communications of the ACM 22 , no. 11 (1979): 612-613. https://dl.acm.org/doi/pdf/10.1145/359168.359176

[CT65]  Cooley, James W. and John W. Tukey. “An algorithm for the machine calculation of complex Fourier series.” Mathematics of Computation 19 (1965): 297-301.
