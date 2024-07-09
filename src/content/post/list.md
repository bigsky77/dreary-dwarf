---
title: "List-Decoding (5/5)"
description: "List-Decoding "
publishDate: "24 June 2024"
tags: ["List Decoding", "Algorithms"]
draft: true
---

# List Decoding

In this appendix we provide a short background on key coding theory concepts such as list-decoding and error-bounds.  When working with error-correcting codes, we seek to balance the trade-offs between our coding *data rate*(the amount of non-redundant information in our code) and the *error rate*(the fraction of symbols that can be corrupted and still allow message recovery).  

List-decoding seeks to find the optimal solution for these trade-offs by outputting a list of close code-words(one of which is correct), instead of a single code-word.  

See [Gur07] and [Gur04] for an depth exploration of list-decoding. 

## List Decoding

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

## REF

[Gur07] Venkatesan Guruswami. "Algorithmic results in list decoding". In *Foundations and Trends in Theoretical Computer Science*, volume 2(2), 2007. [https://www.cs.cmu.edu/~venkatg/pubs/papers/listdecoding-NOW.pdf](https://www.cs.cmu.edu/~venkatg/pubs/papers/listdecoding-NOW.pdf)

[Gur04] Venkatesan Guruswami. "List decoding of error-correcting codes". In *Lecture Notes in Computer Science*, no. 3282, Springer, 2004. [https://www.cs.cmu.edu/~venkatg/pubs/papers/frozen.pdf](https://www.cs.cmu.edu/~venkatg/pubs/papers/frozen.pdf)
