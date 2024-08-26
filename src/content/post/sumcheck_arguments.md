---
title: "On Sumcheck Arguments"
description: "Sumcheck Arguments"
publishDate: "10 August 2024"
tags: ["sumcheck", "algorithms", "IOP", "R1CS", "commitment schemes"]
draft: true 
---

Given a domain $H$, a $\ell$-variate polynomial $p$, and claimed sum $\tau$, Sumcheck is an interactive protocol for proving statements of the form: 

$$
\sum_{\underline{\omega} \in H^{\mathcal{\ell}}}p(\underline{\omega}) = \tau
$$

While the Sumcheck protocol can be used to prove many different kinds of computation, one powerful applications is in *sumcheck arguments* where the protocol is used to prove knowledge of openings for commitment schemes.

$$
\sum_{\underline{\omega} \in \{-1, 1\}^{log n}}f_{cm}(p_m({\underline{\omega}}),p_ck({\underline{\omega}})) = cm 
$$


Furthermore, we can use the same principles to build *zero-knowledge succinct arguments* for satisfiability problems.  In other words, we can use Sumcheck to prove arithmetic circuit satisfiability for R1CS circuits.

## Reference

[BCS21] Jonathan Bootle, Alessandro Chiesa, Katerina Sotiraki "Sumcheck Arguments and their Applications" https://eprint.iacr.org/2021/333.pdf
