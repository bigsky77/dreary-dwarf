---
title: "STIR: Proof of Proximity (4/5)"
description: "STIR: Proof of Proximity "
publishDate: "23 June 2024"
tags: ["low-degree testing"]
---
   
# STIR proof of proximity 

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

