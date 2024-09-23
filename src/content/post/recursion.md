---
title: "Introduction to Interactive Proofs and Mina"
description: "Introduction to Interactive Proofs and Mina"
publishDate: "20 September 2024"
tags: ["mina", "recursion", "IVC", "arithmetization", "plonk", "folding"]
draft: true 
---

*This work is supported by a grant from the Mina Foundation*

This is the first in a series of posts which seek to give the reader a firm theoretical foundation in the basic ideas of Interactive Proofs(IP) and set the groundwork for understanding advanced protocols, particullary recursive proof systems. 

The seminal work in IP arose in the 1980s and early 1990s as researchers sought to develop proof systems capable of handling ever more challenging complexity classes.  And it is with these classes that we will start the series.

## Foundations of Interactive Proofs
### Key properties: Completeness and soundness

Let $(P, V)$ be an interactive proof system for a language $L$, where $P$ is the prover and $V$ is the verifier. We define the following key properties: 
   
 - **Soundness**: We define soundness as: 
  
  $$
  \forall{x} \notin L \ \tilde{P_r}[<\tilde{P}, V(x, r)=1>] = 1/2
  $$ 
    
- **Completeness**: We define completeness as:
   
   $$
   \forall{x} \in L \ P_{r_p, r_v}[<P_{r_p}(x, r_p), V_{r_v}(x, r_v)> = 1] =1 
   $$
    
### Prover-Verifier model and basic protocols
  - Structure of interactive proof systems

$$
\Pr_{r_1,\ldots,r_n}\left[V^{\pi_1,\ldots,\pi_n}(x,r_1,\ldots,r_n) = 1 \Bigg|\
\begin{array}{l}
\pi_1 \leftarrow P(x) \\
\pi_2 \leftarrow P(x,r_1) \\
\vdots \\
\pi_n \leftarrow P(x,r_1,\ldots,r_{n-1})
\end{array}
\right]
$$

- Examples: Graph Isomorphism

### Complexity class IP=NP and its significance
  
NP is the class of languages decidable by a nondeterministic Turing machine in polynomial time. Any language $L$ with an interactive proof system must be $L \in NP$. 

Proof: If an $IP$ exists for $L$, then it must satisfy completeness and soundness properities.  

#### Setup
- **Language** $( L )$: A set of strings such that for any string $( x \in L )$, there exists a proof that $( x \in L )$ which can be verified interactively.
- **Deterministic Verifier**: The verifier’s behavior is fully deterministic, meaning there is no randomness in the verification process.

We aim to show that if a language has such an interactive proof with a deterministic verifier, it belongs to the class $( NP )$ (Nondeterministic Polynomial time).

#### Step 1: Understanding the Structure of an Interactive Proof with a Deterministic Verifier

An interactive proof consists of multiple rounds of communication between the prover and the verifier:
1. The **prover** sends a message (proof step).
2. The **verifier**, based on the received message, computes a response (deterministically) and sends it back to the prover, or accepts/rejects the proof based on the result.

However, since the verifier is deterministic, each response is a fixed computation on the previous messages. This effectively means that all rounds are predetermined based on the initial proof provided by the prover and the input \( x \).

Thus, we can interpret the entire interaction as a single, non-interactive sequence where the prover simply provides the correct answers all at once, anticipating all of the verifier's deterministic responses.

#### Step 2: Reducing to a Classical $( NP )$ Proof

In $( NP )$, a language $( L )$ belongs to the class if there exists a **polynomial-time verifier** $( V(x, w) )$ that can check the validity of a **witness** $( w )$ (the proof) for an input $( x )$.

- In our case, the **prover** can be viewed as supplying the entire transcript of the interaction, including the answers to all of the deterministic verifier's queries, as a single proof.
- The verifier, upon receiving this entire transcript, can deterministically verify if the transcript is valid by simulating the interactive proof process in polynomial time.

### IP = PSPACE theorem overview
  
  One of the most important theorems in the history of IP, comes from Adi Shamir and his proof that IP = PSPACE.

## II. Interactive Oracle Proofs (IOPs)
- **A. Definition and distinguishing features**
  - Comparison with traditional interactive proofs
  - Structural components of IOPs
- **B. Advantages over traditional interactive proofs**
  - Improved efficiency and scalability
  - Enhanced expressiveness
- **C. Relationship to Probabilistically Checkable Proofs (PCPs)**
  - Similarities and differences
  - Historical development from PCPs to IOPs

## III. Proof Recursion: Concept and Mechanisms
- **A. Definition and motivation**
  - What is proof recursion?
  - Why is it important in modern cryptography?
- **B. Basic principles of recursive proof composition**
  - Recursive SNARKs
  - Cycles of elliptic curves
- **C. Efficiency considerations in recursive proofs**
  - Time and space complexity
  - Proof size and verification time


## References

[GMR]  Goldwasser, S.; Micali, S.; Rackoff, C. (1989), "The knowledge complexity of interactive proof systems" (PDF), SIAM Journal on Computing, 18 (1): 186–208, doi:10.1137/0218012, ISSN 1095-7111
