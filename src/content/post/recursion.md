---
title: "Gateway to Recursive ZK: Introduction to Interactive Proofs"
description: "Overview of proof recursion"
publishDate: "20 September 2024"
tags: ["mina", "recursion", "IVC", "arithmetization", "plonk", "folding"]
draft: true 
---

*This work is supported by a grant from the Mina Foundation*

## Background on Interactive Oracle Proofs

## What is Proof Recursion?

An interactive oracle proof is defined as a tuple of algorithms $\pi = IOP(P, V)$, which prove the veracity of some computation. Proof recursion adds a third accumulator algorithm  $\pi_1,..,\pi_n = A(P,V)$ which batches and contains all the previous proofs produced by the prover and the verifier.  A common technique is to use random linear combinations to "fold" circuit constraints.  Given a series of constraint systems $z_1,..,z_n = (W, x, 1)$ , we fold each constraint into the next using a random linear combination using some randomness $\alpha$:

$$
z_3 = z_1 + \alpha_1 \cdot z_2 \\
. \\
. \\
. \\
z_n = z_i + \alpha_n \cdot z_j \\
$$

This powerful technique is known as incrementally verifiable computation (IVC).  While powerful, this technique does introduce some over head in the form of error accumulaltion during each round.  To mitigate this, we use a relaxed form of R1CS which takes the form where $e$ accumulates each error term: 

$$
M + N = s \cdot O + e
$$ 




## Ref 


