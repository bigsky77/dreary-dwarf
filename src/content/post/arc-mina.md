---
title: "Rebuilding Mina with ARC"
description: "Exploring the benefits and challenges of integrating ARC into Mina's recursive proof system"
publishDate: "1 December 2024"
tags: ["cryptography", "Mina", "ARC", "recursive proofs", "proof-carrying data", "SNARKs"]
draft: False 
---

*This work is supported by a grant from the Mina Foundation*

## Introduction

Mina's current architecture relies heavily on recursive SNARKs built over elliptic curves to maintain its succinct blockchain. While this approach has proven successful, recent advances in hash-based proof systems like ARC (Accumulation for Reed-Solomon Codes) offer potential alternatives that could provide stronger security guarantees and improved efficiency. In this post, we explore how ARC could be integrated into Mina's protocol and analyze the benefits and challenges of such a transition.

## Current Mina Architecture

Mina achieves its succinctness through recursive composition of SNARKs where each state transition (block) is proven valid through a new SNARK proof that verifies:
1. The previous state was valid (by verifying the previous proof)
2. The new block's transactions are valid
3. The consensus rules were followed

The current system relies on cycles of elliptic curves to enable efficient recursive proof composition. While effective, this approach has some limitations:

- Requires large cryptographic fields
- Vulnerable to quantum attacks
- Complex implementation of curve cycles

## How ARC Could Help

ARC provides several key benefits that make it an attractive alternative:

1. Post-quantum security through reliance on hash functions rather than elliptic curves
2. Support for arbitrary field sizes, enabling more efficient arithmetic
3. Unbounded accumulation depth without efficiency degradation
4. Simpler cryptographic assumptions

The core idea would be to replace Mina's recursive SNARK system with ARC's accumulation scheme for Reed-Solomon proximity claims. This would involve:

1. Encoding blockchain state transitions as claims about Reed-Solomon codewords
2. Using ARC to accumulate these claims instead of composing SNARK proofs
3. Leveraging ARC's direct approach for R1CS constraints to handle transaction verification

## Required Protocol Changes

To integrate ARC into Mina, several key protocol components would need to be modified:

### State Representation

Current:
```plaintext
- SNARK proof verifying previous state + new block
- State commitment through Merkle trees
```

Needed changes:
```plaintext
- RS encoding of state and transactions
- ARC accumulator consisting of two parts:
  1. RS proximity accumulator
  2. Accumulated witness for polynomial identities
```

### Consensus Mechanism

The Ouroboros Samasika consensus would need to be adapted to work with ARC's hash-based proofs rather than the current elliptic curve based system. This includes:

1. Modifying the leader selection VRF to use hash-based primitives
2. Adapting chain selection rules to work with ARC accumulators
3. Ensuring consensus proofs can be efficiently accumulated

### Transaction Processing

The transaction verification pipeline would need to be redesigned to:

1. Express transaction validity in terms of RS proximity claims
2. Use ARC's direct R1CS accumulation scheme
3. Maintain efficient parallel processing capabilities

## Benefits

The integration of ARC into Mina's protocol offers several significant advantages that extend beyond simple technical improvements. Let's examine these benefits in detail:

### Enhanced Security Model

The shift to hash-based primitives provides a more robust security foundation. Unlike the current elliptic curve based system, ARC's security relies primarily on cryptographic hash functions, which are believed to be resistant to quantum attacks. This transition would position Mina ahead of potential quantum computing threats, providing long-term security assurance for the network.

The simplified cryptographic assumptions also make the protocol easier to analyze and verify. Rather than depending on the complex mathematical relationships required for cycles of elliptic curves, the security analysis can focus on well-understood properties of hash functions.

### Improved Efficiency

ARC's approach to accumulation brings substantial efficiency gains across multiple dimensions. The ability to work with smaller field sizes translates directly to reduced computational overhead for basic arithmetic operations. This is particularly important for Mina, where every transaction requires extensive cryptographic computations.

The removal of expensive elliptic curve operations represents another significant efficiency improvement. Current elliptic curve operations are computationally intensive and require careful implementation to avoid timing attacks. ARC's hash-based approach eliminates these concerns while potentially offering better performance.

Perhaps most importantly, ARC provides constant-time proof verification regardless of accumulation depth. This property ensures that verification costs remain predictable and manageable as the blockchain grows, reinforcing Mina's core value proposition of a succinct blockchain.

### Implementation Advantages

The implementation benefits of ARC extend beyond just technical simplicity. The removal of curve cycles eliminates one of the most complex aspects of Mina's current implementation. This simplification would make the protocol more accessible to developers and reduce the potential for implementation errors.

The cleaner proof composition system would also make it easier to modify and upgrade the protocol in the future. New features or optimizations could be added with greater confidence, as the simpler cryptographic foundation provides clearer security boundaries and fewer potential interaction effects.

## Challenges

While the benefits of integrating ARC are compelling, there are several significant challenges that need to be carefully considered and addressed:

### Technical Migration Complexity

The transition from the current SNARK-based system to ARC represents a fundamental change to Mina's architecture. This migration presents several complex technical challenges:

The existing tooling ecosystem, including block explorers, wallets, and development frameworks, would need significant updates to handle the new proof system. This includes adapting to different proof formats, new verification procedures, and modified state representations.

Client implementations would require substantial revisions to support ARC's accumulation scheme and RS encoding. This affects not just the core protocol implementation, but also light clients and other network participants. Ensuring backward compatibility during the transition period adds another layer of complexity.

### Performance Tradeoffs

While ARC offers efficiency improvements in many areas, it also introduces new performance considerations that must be carefully evaluated:

The RS encoding and decoding operations required by ARC have different performance characteristics than the current system. These operations need to be highly optimized to maintain Mina's performance requirements, particularly for parallel proof generation.

The shift to hash-based primitives may affect transaction throughput and block production times in ways that need to be thoroughly understood and optimized. Initial benchmarking suggests these impacts could be managed, but extensive testing under realistic network conditions is essential.

### Protocol Adaptation Challenges

Adapting Mina's protocol to work with ARC requires more than just technical changes to the proof system:

The consensus mechanism needs careful modification to maintain its security properties while working with ARC's different proof structure. This includes ensuring that the chain selection rules remain efficient and secure when working with accumulated proofs instead of recursive SNARKs.

The transaction verification pipeline must be redesigned to express validity conditions in terms of RS proximity claims while maintaining efficient parallel processing capabilities. This redesign needs to preserve the protocol's current functionality while taking advantage of ARC's strengths.

## Required Next Steps

1. Prototype implementation demonstrating:
   - RS encoding of Mina's state
   - ARC accumulation of block transitions
   - Modified consensus mechanism

2. Performance benchmarking comparing:
   - Proof generation times
   - Verification costs
   - Storage requirements

3. Security analysis:
   - Formal security proofs with new primitives
   - Analysis of quantum security claims
   - Review of cryptographic assumptions

## Conclusion

Integrating ARC into Mina offers compelling benefits in terms of security, efficiency, and simplicity. However, it represents a significant protocol change that would require careful design, extensive testing, and a well-planned migration strategy. The potential improvements in security and efficiency make it worth exploring further, particularly as quantum computing concerns become more pressing.

Future work could focus on:
1. Detailed technical specification of required changes
2. Prototype implementation and benchmarking
3. Formal security analysis
4. Migration planning and backwards compatibility

The path forward likely involves a gradual transition, perhaps starting with a parallel implementation that can be thoroughly tested before any migration begins.

## References

1. Bünz, B., Mishra, P., Nguyen, W., & Wang, W. (2024). ARC: Accumulation for Reed--Solomon Codes. *Cryptology ePrint Archive, Paper 2024/1731*.
