---
title: "SuperSparta and HyperNova"
description: "SuperSparta and HyperNova"
publishDate: "14 August 2024"
tags: ["sumcheck", "algorithms", "IOP"]
draft: true 
---

Customizable Constraint System (CCS), is a generalized constraint system that can
simultaneously capture R1CS, Plonkish, and AIR.

$$

\sum_{i=1}^{q-1}c_i \cdot \bigcirc_{j \in S_i} M_j \cdot z = 0
$$

Where $z$:

$$
z = (w, 1,x) \in \mathbb{F}^n
$$

A relation can be represented in CCS form in the following way: 

$$
c_1 \cdot (M_1 \cdot z \circ M_2 \cdot z) + c_2 \cdot (M_3 \cdot z) = 0
$$

Where $z$ contains the elements of our relation.


## Protocol

1. $\mathcal{P} \rightarrow \mathcal{V}$: Sending a multivariate polynomial $\tilde{W}$
2. $\mathcal{V} \rightarrow \mathcal{P}$: Sending random challenges $\tau \in_R \mathcal{F}^{log \ m}$
3. $\mathcal{P} \leftrightarrow \mathcal{V}$: Run sumcheck reduction

    a. Apply sumcheck protocol 
    
    $$
    g(a) := \tilde(eq)(\tau, a) \cdot \sum_{i=0}^{q-1} c_i \prod_{j \in S_i} \left( \sum_{y \in {0,1}^{log \ m}} \tilde{M}_j(a, y) \cdot \tilde{Z}(y) \right)
    $$ 
    
    and confirm that $g$ is equal to 0:
    
    $$
    \sum_{\mathcal{b} \in \{0,1\}^{log \ m}} g(b) 
    $$
    
    b.$\mathcal{V} \rightarrow \mathcal{P}$: Choose a random $\tau \in \mathbb{F}$ and send to $\mathcal{P}$ 

    c. $\mathcal{P} \leftrightarrow \mathcal{V}$: Apply sumcheck a second time and check
    
    $$
    \sum_{i=0}^{t-1} \sum_{y \in \{0,1\}^{log \ n}} \tau^i \cdot \tilde{M}_i (r_a, y) \cdot  \tilde{Z}(y)  
    $$

4. $\mathcal{V}$: Checks that

    a. $\forall i \in \{0, 1, ..., t-1\}, \tilde{M}_i(r_x, r_y) = v_i$ with a single query to $\tilde{M_i}$

    b. Check that $\tilde{Z}(r_y) = v_z$ by checking:
    
    $$
    v_z = (1 - r_y[1]) \cdot v_w + r_y[1] \cdot \tilde{(x, 1)}(r_y[2..])
    $$
    
    where $r_y[2..]$ refers to a slice of $r_y$ without the first element of $r_y$,  and where $v_w \leftarrow \tilde{W}(r_y[2..])$ represents an oracle query.
