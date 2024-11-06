---
title: "The Research -> Systems -> Application Cycle"
description: "Multi-Processor"
publishDate: "6 November 2024"
tags: ["Architecture", "Algorithms", "Multi-Processor"]
draft: False 
---

My journey into serious computer science research began at Ingonyama while building a GPU-accelerated **PLONK prover**. At the outset, I approached the project purely from an engineering perspective. Fortunately, the Ingonyama team had just developed an accelerated **Groth16 prover**, and I diligently studied their codebase to replicate a similar approach for PLONK. As I delved deeper, I encountered unfamiliar concepts like **MSM (Multi-Scalar Multiplication)** and **FFT (Fast Fourier Transform)**. Gradually, I realized these were not just peripheral algorithms but the core computational building blocks behind any zero-knowledge proof system.

The significance of these algorithms, whose existence I previously took for granted, suddenly became apparent. For the first time, I began to grasp the complex mathematics underpinning processes I had been using without full understanding. This realization marked a pivotal shift in my approach: I could no longer treat these components as black boxes but needed to comprehend their inner workings to progress further.

## Transitioning from Engineering to Research

Eventually, I reached a point where no amount of engineering could fix the extremely subtle bugs and errors in the program. These issues were not due to coding mistakes but stemmed from a deeper misunderstanding of the underlying mathematics of PLONK. For the first time in my computing journey, I encountered design constraints outside the realm of pure engineering. The only way to resolve these bugs was to develop a deeper understanding of the actual PLONK zkSNARK protocol. This required diving into the mathematical foundations presented in the original PLONK whitepaper.

## Understanding the Layers: Applications, Systems, and Research

When learning to write code, we naturally start by building **applications**. Applications are an obvious starting point because they are the programs we interact with directly in our daily lives—think of web browsers, mobile apps, or desktop software. From applications, we eventually encounter issues that cannot be solved at the interface level. This leads us to engineering or building **systems**—the core engines and frameworks that power many applications.

But what are these systems built on? They are built on **research**—the theoretical groundwork that introduces new algorithms, data structures, and computational paradigms. In the context of zero-knowledge proofs, research involves developing new proving schemes, optimizing existing protocols, and advancing the mathematical theories that make these technologies possible.

### Defining Each Layer

**Research**: This layer involves creating new knowledge, algorithms, and theoretical frameworks. Researchers work on proving security properties, developing new cryptographic protocols, and pushing the boundaries of what's computationally feasible.

*Example in Zero-Knowledge Proofs*: Developing the PLONK protocol itself was a research endeavor. It required inventing new mathematical constructs and proving their properties.

**Systems**: Systems engineers take the theoretical constructs developed by researchers and implement them into practical, efficient, and reliable software components. This involves writing optimized code, managing resources, and ensuring security at the implementation level.

*Example in Zero-Knowledge Proofs*: Implementing the PLONK protocol in software, optimizing MSM and FFT operations for GPUs, and ensuring that the implementation is secure against side-channel attacks.

**Applications**: Application developers use systems to build software that solves end-user problems. They focus on usability, user experience, and meeting specific user needs.

*Example in Zero-Knowledge Proofs*: Building a decentralized application (dApp) that uses PLONK-based proofs to enable private transactions on a blockchain.

### Demarcating the Boundaries

Understanding the boundaries between these layers is crucial:

- **Research ↔ Systems**: Researchers provide the theoretical models, while systems engineers ensure these models are viable in practice. Miscommunication here can lead to inefficient implementations or overlooked security flaws.

- **Systems ↔ Applications**: Systems provide the tools and libraries that applications rely on. Application developers need to understand the capabilities and limitations of these systems to build effective software.

- **Research ↔ Applications**: While less direct, innovations in research can enable entirely new classes of applications, and challenges faced in applications can inspire new research directions.

## The Different Mindsets Required

Each layer demands a different kind of thinking:

- **Research Mindset**: Abstract, theoretical, and often proof-oriented. Researchers ask "What is possible?" and "How can we prove this works securely?"

- **Systems Engineering Mindset**: Practical, efficiency-focused, and detail-oriented. Systems engineers ask "How can we implement this efficiently?" and "How do we ensure this is secure in practice?"

- **Application Development Mindset**: User-focused, problem-solving, and often iterative. Application developers ask "What does the user need?" and "How can we solve the user's problem effectively?"

## The Accelerating Cycle in Modern Computing

The cycle from research to systems to application is accelerating, especially in fields like zero-knowledge proofs and blockchain technology. In the past, developers could spend their entire careers at one level without needing to engage deeply with the others. Research was often abstract and disconnected from practical applications, systems were built in isolation from end-user concerns, and applications were developed without a deep understanding of the underlying systems or research.

Today, the landscape is different. Innovations move from research to production at a rapid pace. For example, new zero-knowledge protocols are quickly implemented into systems and used in applications within months. This acceleration requires professionals to be adaptable and conversant across all layers.

## Navigating Between Layers Effectively

Because we must quickly jump between layers, it's important to:

- **Recognize the Current Layer**: Understand whether you're dealing with research, systems, or applications to apply the appropriate problem-solving approach.

- **Understand the Context**: Each layer has its own context and constraints. What makes sense in research might not be practical in systems, and what works in systems might not meet the user's needs in applications.

- **Communicate Across Layers**: Effective communication between researchers, systems engineers, and application developers is essential. This ensures that theoretical advances are implemented correctly and that practical needs inform future research.

## Avoiding Common Pitfalls

While blending mindsets can be beneficial, it can also lead to issues:

- **Over-Engineering**: Applying a research mindset to application development can result in unnecessary complexity. For instance, implementing a cutting-edge cryptographic protocol when a simpler solution suffices.

- **Underestimating Complexity**: Application developers might oversimplify system-level challenges, leading to inefficient or insecure applications.

- **Ignoring Practical Constraints**: Researchers might propose solutions that are theoretically sound but impractical due to resource constraints, which systems engineers must address.

## Real-Life Example: Implementing PLONK in Practice

To illustrate these concepts, let's consider the process of implementing PLONK in practice:

1. **Research Phase**: Cryptographers develop the PLONK protocol, proving its security and efficiency theoretically.

2. **Systems Phase**: Systems engineers work on implementing PLONK efficiently. This involves optimizing algorithms like MSM and FFT for specific hardware (e.g., GPUs), ensuring memory efficiency, and protecting against side-channel attacks.

3. **Application Phase**: Developers build applications that leverage the PLONK implementation. For example, creating a privacy-preserving smart contract platform where users can execute transactions without revealing their data.

At each phase, different challenges arise, and different expertise is required. Recognizing which layer you're working in helps in addressing these challenges effectively.

## Conclusion

Understanding this cycle has transformed how I approach technical challenges. When I hit a wall building applications, I know to dive into systems. When system optimizations aren't enough, I know to explore the research. Each layer provides a new set of tools and perspectives.
Most importantly, moving between these layers has taught me that the best solutions often come from seeing the whole picture. Whether you're stuck on a thorny research problem or a frustrating user interface bug, the answer might lie in a different layer than you expect.

The key isn't mastering any one layer – it's learning to move fluently between them. 
