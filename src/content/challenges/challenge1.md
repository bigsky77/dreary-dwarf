---
title: "Analysis of Soundness Under Adversarial Manipulation in the Permutation Check"
draft: false
publishDate: 2024-10-01
updatedDate: 2024-10-02
---

In the permutation check of the Plonk protocol, the prover constructs a grand product polynomial $Z(X)$ using randomness introduced via challenge elements from the verifier...

$$\prod_{i=0}^{n-1} \frac{(x_i + \beta \cdot k_i + \gamma)}{(x_i + \beta \cdot \sigma(i) + \gamma)} = 1$$
