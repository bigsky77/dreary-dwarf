---
title: "Notes on Bridge Design"
description: "Bridge Design"
publishDate: "17 March 2025"
tags: ["cryptography", "bridges", "blockchain"]
draft: False 
---

Bridges are tools used to replicate state transition functions between blockchains.  In the most common form these state transitions are token transfers. The central challenge of bridge design comes from reconcilling differing blockchain archicture while maintaining an acceptable level of decentralization.

My goal with this post is to formalize some of the core concepts related to bridge design.  Currently there is so much jargon and terminology in the field that the core concepts often become lost.  While the mathematical concepts are *very* rough, I find this level of detail and notation very useful for working with the concepts and defining exactly what is happening during a bridge operation.  The math in this paper will be far to high-level and abstract for most mathematicians, while the computer science will be too hand-wavy and conceptual for the computer scientists but it works for me and that is all that matters!

## Definitions

### Blockchain

A blockchain is a sequence of blocks $B = (B_0, B_1, B_2, ..., B_n)$ 

where each block contains the following properties:

$$B_i = (H_i, T_i, N_i, H_{i-1})$$

- $B_i$ represents the $i$-th block
- $H_i$ is the cryptographic hash of block $B_i$
- $T_i = \{t_1, t_2, ..., t_m\}$ is the set of transactions in block $B_i$
- $N_i$ is a nonce value used in proof-of-work systems
- $H_{i-1}$ is the hash of the previous block (creating the chain), with $H_{-1} = 0$ for the genesis block

The blockchain is considered valid if and only if:

$$\forall i \in \{1,2,...,n\}: H_{i-1} \text{ in } B_i = H_{i-1} \text{ computed from } B_{i-1}$$

#### Blockchain State 

Let $\Sigma$ denote the state space of the blockchain. At any block height $i$, the blockchain has state $\sigma_i \in \Sigma$.

A transaction $t$ can be defined as:
$$t = (s, r, v, d, g, p, \text{sig})$$

Where:
- $s$ is the sender address
- $r$ is the recipient address
- $v$ is the value being transferred
- $d$ is the transaction data (for contract interactions)
- $g$ is the gas limit
- $p$ is the gas price
- $\text{sig}$ is the cryptographic signature to authenticate the transaction

#### State Transition Function

The state transition function $\Gamma$ maps the current state and a block of transactions to a new state:

$$\sigma_{i+1} = \Gamma(\sigma_i, B_i)$$

Where $B_i$ is the block containing transactions $T_i = \{t_1, t_2, ..., t_m\}$.

This can be decomposed into transaction-level state transitions:

$$\sigma_{i,j+1} = \delta(\sigma_{i,j}, t_j)$$

Where:
- $\sigma_{i,0} = \sigma_i$ (the state before any transaction in block $i$ is applied)
- $\sigma_{i,m} = \sigma_{i+1}$ (the state after all transactions in block $i$ are applied)
- $\delta$ is the transaction-level state transition function

### State Storage and Light Clients

The blockchain state $\sigma$ is stored in a Merkle Patricia Trie structure $\mathcal{T}$:

$$\mathcal{T}: \mathcal{K} \rightarrow \mathcal{V}$$

Where:
- $\mathcal{K}$ is the key space (typically account addresses)
- $\mathcal{V}$ is the value space (account states including balances, nonces, etc.)

The root hash of this trie provides a cryptographic commitment to the entire state:

$$\text{StateRoot} = \mathcal{H}(\mathcal{T})$$

Where $\mathcal{H}$ is a cryptographic hash function.

#### Merkle Proofs

For any key-value pair $(k, v)$ in the state, a Merkle proof $\pi$ can be constructed:

$$\pi_{k,v} = \{\text{sibling hashes along path from leaf to root}\}$$

The validity of a proof can be verified by:

$$\text{VerifyProof}(\text{StateRoot}, k, v, \pi_{k,v}) = \text{true}$$

If and only if $(k, v)$ is indeed in the state trie with root $\text{StateRoot}$.

#### Light Clients

A light client maintains only block headers rather than the full state:

$$LC = \{H_0, H_1, ..., H_n\}$$

Where each header $H_i$ contains:

$$H_i = (\text{StateRoot}_i, \text{TxRoot}_i, \text{ReceiptRoot}_i, ...)$$

#### Light Client Verification

To verify that a transaction $t$ is included in block $i$:

1. Verify that header $H_i$ is valid in the chain
2. Request Merkle proof $\pi_t$ for transaction $t$
3. Verify $\text{VerifyProof}(\text{TxRoot}_i, \text{index}(t), t, \pi_t) = \text{true}$

To verify a state query for key $k$ with value $v$ at block $i$:

1. Request Merkle proof $\pi_{k,v}$ for $(k, v)$ at block $i$
2. Verify $\text{VerifyProof}(\text{StateRoot}_i, k, v, \pi_{k,v}) = \text{true}$

## Bridges as Functors 

At the highest level we can think of a blockchain bridge as a functor $F: \mathcal{B}_1 \rightarrow \mathcal{B}_2$ such that:

1. For each state $\sigma_i \in \text{Obj}(\mathcal{B}_1)$, there exists a mapping $F(\sigma_i) \in \text{Obj}(\mathcal{B}_2)$

2. For each valid transition $f: \sigma_i \rightarrow \sigma_j$ in $\mathcal{B}_1$, there exists a corresponding valid transition $F(f): F(\sigma_i) \rightarrow F(\sigma_j)$ in $\mathcal{B}_2$

3. The functor preserves composition: $F(g \circ f) = F(g) \circ F(f)$

4. The functor preserves identity: $F(\text{id}_{\sigma_i}) = \text{id}_{F(\sigma_i)}$

We evaluate bridges on two primary axis **Security Properties** and **Trust Assumptions**.

###  Security Properties

The security of a bridge can be expressed as preservation of certain invariants across the functor $F$:

1. **Conservation of Assets**: For any state $\sigma_i \in \mathcal{B}_1$, the total value of assets in $\text{Asset}_1(\sigma_i)$ equals the total value of assets in $\text{Asset}_2(F(\sigma_i))$ (modulo locked assets)

2. **Finality Preservation**: If $f: \sigma_i \rightarrow \sigma_j$ is a finalized transition in $\mathcal{B}_1$, then $F(f): F(\sigma_i) \rightarrow F(\sigma_j)$ must also be finalized in $\mathcal{B}_2$

3. **Consistency**: For any states $\sigma_i, \sigma_j \in \mathcal{B}_1$, if $\text{Hom}_{\mathcal{B}_1}(\sigma_i, \sigma_j) = \emptyset$, then $\text{Hom}_{\mathcal{B}_2}(F(\sigma_i), F(\sigma_j)) = \emptyset$

### Trust Assumptions

1. **Light-Client Bridge**: $F$ is equipped with a verification functor $V: \mathcal{B}_1 \rightarrow \mathcal{L}$ where $\mathcal{L}$ is a subcategory of $\mathcal{B}_2$ containing lightweight verification objects (block headers, Merkle proofs)
   $F(\sigma_i) = \{\sigma_j \in \mathcal{B}_2 \mid \sigma_j \text{ is consistent with } V(\sigma_i)\}$

2. **Validity-Proof Bridge (ZK Bridge)**: $F$ is associated with a proof system $\pi: \mathcal{B}_1 \times \mathcal{B}_2 \rightarrow \{\text{true}, \text{false}\}$ such that:
   $\pi(\sigma_i, F(\sigma_i)) = \text{true} \iff F \text{ correctly maps } \sigma_i$
   where $\pi$ is efficiently verifiable in $\mathcal{B}_2$ without knowledge of the full state of $\mathcal{B}_1$

3. **Optimistic Bridge**: $F$ is paired with a challenge functor $C: \mathcal{B}_1 \times \mathcal{B}_2 \rightarrow \mathcal{B}_2$ where:
   $F_t(\sigma_i) = \begin{cases}
   F(\sigma_i) & \text{if no valid challenge } C(\sigma_i, F(\sigma_i)) \text{ within time } t \\
   \text{reject} & \text{otherwise}
   \end{cases}$

4. **Multi-Signature Bridge**: $F$ is factored through an adjudication category $\mathcal{A}$ with a consensus functor $G: \mathcal{A} \rightarrow \mathcal{B}_2$ such that:
   $F = G \circ H$
   where $H: \mathcal{B}_1 \rightarrow \mathcal{A}$ maps blockchain states to adjudication states requiring $m$-of-$n$ consensus

## Interoperability Trilemma

Let $\mathcal{B}$ be the set of all blockchains. For any blockchain bridge system $\mathcal{F}$, we define three properties:

1. **Trustlessness ($T$)**: The security of the bridge approaches the minimum security of the connected chains.
   $$T(\mathcal{F}) = \min_{(B_i, B_j) \in \text{Dom}(\mathcal{F})} \{\text{Sec}(B_i), \text{Sec}(B_j)\}$$
   where $\text{Sec}(B)$ represents the security level of blockchain $B$.

2. **Extensibility ($E$)**: The ability to connect any pair of blockchains from the set $\mathcal{B}$.
   $$E(\mathcal{F}) = \frac{|\{(B_i, B_j) \in \mathcal{B} \times \mathcal{B} : (B_i, B_j) \in \text{Dom}(\mathcal{F})\}|}{|\mathcal{B}|^2}$$
   where $E(\mathcal{F}) = 1$ means complete extensibility.

3. **Generalizability ($G$)**: The ability to transfer arbitrary data across chains.
   $$G(\mathcal{F}) = \frac{|\mathcal{M}(\mathcal{F})|}{|\mathcal{M}_{total}|}$$
   where $\mathcal{M}(\mathcal{F})$ is the set of message types supported by $\mathcal{F}$ and $\mathcal{M}_{total}$ is the set of all possible message types.

### The Trilemma Formalization

The Interoperability Trilemma states that for any bridge system $\mathcal{F}$:

$$T(\mathcal{F}) \cdot E(\mathcal{F}) \cdot G(\mathcal{F}) \leq k$$

Where $k$ is a constant significantly less than 1, representing the fundamental trade-off limit.

## References 

https://medium.com/connext/the-interoperability-trilemma-657c2cf69f17

https://ethereum.org/en/developers/docs/bridges/

https://arxiv.org/pdf/1801.09515

https://arxiv.org/pdf/2210.0026o4

https://eprint.iacr.org/2019/1128.pdf
