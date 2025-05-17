---
title: "Rings with Polynomial Identities"
description: "Exploring PI-rings and their applications"
publishDate: "25 March 2025"
tags: ["algebra", "cryptography", "zero-knowledge", "polynomial identities", "PI-rings"]
draft: true 
---

*This post is part of an ongoing series exploring algebraic structures in modern cryptography*

Rings are one of the basic mathematical structures used in modern cryptography.

The algebriac structure of a Ring $R$ comes in many shapes and sizes.  One of the most basic examples is that of the real numbers. 

## Ideals

An ideal is a special subset of a ring that absorbs multiplication by any ring element. Formally, for a ring $(R, +, \cdot)$, a subset $I \subseteq R$ is an ideal if:

1. $(I, +)$ is a subgroup of $(R, +)$
2. For all $r \in R$ and $i \in I$, both $r \cdot i \in I$ and $i \cdot r \in
 I$

## Variety

A variety (or algebraic variety) is the set of solutions to a system of
polynomial equations. Formally, for polynomials $f_1, f_2, ..., f_n \in
k[x_1,...,x_m]$ over a field $k$, the variety $V(f_1,...,f_n)$ is the set of
points $(a_1,...,a_m) \in k^m : f_i(a_1,...,a_m) = 0 \text{ for all } i$.

