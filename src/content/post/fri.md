---
title: "FRI: Low-Degree Test (3/5)"
description: "FRI: Low-Degree Test"
publishDate: "22 June 2024"
tags: ["low-degree testing", "FRI"]
---

# FRI proof of proximity

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
   
### REF

[H22] Ulrich Haböck. "A summary on the FRI low degree test". *Cryptology ePrint Archive*, Report 2022/1216. 2022. [https://eprint.iacr.org/2022/1216.pdf](https://eprint.iacr.org/2022/1216.pdf)

[VIT] Vitalik Buterin. "STARKs, part 2: Thank goodness for FRI". Vitalik's blog, 2017. [https://vitalik.eth.limo/general/2017/11/22/starks_part_2.html](https://vitalik.eth.limo/general/2017/11/22/starks_part_2.html)

[ASZ] Alan Szepieniec. "Anatomy of STARKs: FRI". 2020. [https://aszepieniec.github.io/stark-anatomy/fri](https://aszepieniec.github.io/stark-anatomy/fri)

