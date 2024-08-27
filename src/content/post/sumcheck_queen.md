---
title: "Sumcheck: The Queen of Algorithms"
description: "Sumcheck: The queen of Algorithms"
publishDate: "24 July 2024"
tags: ["sumcheck", "algorithms", "IOP"]
draft: false 
---

### Overview:

When discussing algorithms, cryptographers speak of the Sumcheck protocol with a hushed voice and a tone of awe.  Not because of it's complexity or difficulty, but because of the sheer beauty of the protocol.

The Sumcheck protocol seeks to prove that a claimed sum $H \in F_p$ is in fact equal to:

$$
H := \sum_{x_1 \in \{0,1\}} \sum_{x_2 \in \{0,1\}}... \sum_{x_n \in \{0,1\}} f(x_1, x_2,...,x_n)
$$

Or in other words that the sum of evaluations to a multilinear polynomial over some boolian inputs is equal to what is claimed.

### Protocol:

#### Setup:

Let's start with an extremely simple function.

$$
\phi(x_1, x_2, x_3) = x_1 \ AND \ (x_2 \ OR \ x_3)
$$

Say we want to compute the number of boolian inputs which result in a true output, without running all the computation ourselves.  We can do this by running a structured Interactive Oracle Proof (IOP), between a prover and a verifier.  The function above arithmitizes to the following formula.

$$
f(x_1, x_2, x_3) = x_1 \cdot (x_2 + x_3) - (x_2 \cdot x_3)
$$

To calculate $H$ the prover first computes the value of $f_0(x_1, x_2, x_3)$ at all boolian inputs.

$$
f(0, 0, 0) = 0 \cdot (0 + 0) - (0 \cdot 0) = 0 \\
f(1, 0, 0) = 1 \cdot (0 + 0) - (0 \cdot 0) = 0 \\
f(0, 1, 0) = 0 \cdot (1 + 0) - (1 \cdot 0) = 0 \\
f(0, 0, 1) = 0 \cdot (0 + 1) - (0 \cdot 1) = 0 \\ 
f(0, 1, 1) = 0 \cdot (1 + 1) - (1 \cdot 1) = -1 \\ 
f(1, 1, 0) = 1 \cdot (1 + 0) - (1 \cdot 0) = 1 \\ 
f(1, 0, 1) = 1 \cdot (0 + 1) - (0 \cdot 1) = 1 \\
f(1, 1, 1) = 1 \cdot (1 + 1) - (1 \cdot 1) = 1 \\
$$

Summing the values, we see that $f_0 = 2$.

Now that we have the basic of the algorithm set up we are ready to start the actual IOP.

#### Round 1:

$\mathcal{P}$ sends the following univeriate polynomial to $\mathcal{V}$:

$$
f_1(X_1) := \sum_{x_0 \in {0,1},.., x_n \in {0,1}} f(X_1, x_1,..., x_n)
$$

$\mathcal{V}$ checks that $f_1$ is of degree at most $d \le deg_1(d)$ and that $H = f_1(0) + f_1(1)$.  The verifier does this by computing a partial sum of $f_1$ leaving the first variable free.

$$
f(X_1, 0, 0) = X_1 · (0 + 0) - (0 · 0) = 0           \\
f(X_1, 1, 0) = X_1 · (1 + 0) - (1 · 0) = X_1         \\
f(X_1, 0, 1) = X_1 · (0 + 1) - (0 · 1) = X_1         \\
f(X_1, 1, 1) = X_1 · (1 + 1) - (1 · 1) = 2X_1 - 1    \\
$$

Leaving us with $f_1(X_1) = 4X_1 - 1$.

#### Round 2:

Now $\mathcal{V}$ checks that $f_0 = f_1(0) + f_1(1)$.

Becuase we know that $f_0 = 2$ and $f_1(X1) = 4X_1 - 1$, the verifier is able to confirm that $2 = 4(0) -1 + 4(1) - 1$.

#### Round 3:

$\mathcal{V}$ selects a random field element $r_1 \in \mathbb{F_p}$ and sends it to $\mathcal{P}$. Becuase $\mathbb{F_p}$ is a field, all operations within the field will occur modulos $p$.

Note: For the rest of this walkthrough assume $p=10$ and $r_1=4$.

#### Round 4:

$\mathcal{P}$ replaces $x_1$ with the random variable $r_1$.

$$
f_2(X_2) := \sum_{x_0 \in \{0,1\},.., x_n \in \{0,1\}} f(r_1, X_2,..., x_n)
$$

#### Round 5:

For the $1 < j < n$ rounds, $\mathcal{P}$ sends the univeriate polynomial:

$$
f_j(X_j) := \sum_{x_0 \in \{0,1\},.., x_n \in \{0,1\}} f(r_1,...,r_j,X_j,..., x_n)
$$

And $\mathcal{v}$ checks that $f_{j-1}(r_{j-1}) = f_j(0) + f_j(1)$.

If the check passes, $\mathcal{V}$ sends $r_j \in \mathbb{F}$ to $\mathcal{P}$.

In our example round, $X_1$ is replaced by $r_1$ and the next variable $x_2$ is left free. 

$$
f(4, X_2, 0) =4  \cdot (X_2 + 0) - (X_2 \cdot 0) = 4X_2 \\
f(4, X_2, 1) =4  \cdot (X_2 + 1) - (X_2 \cdot 1) = 3X_2 + 4 \\ 
$$

This results in $f_2(X_2) = 7X_2 + 4$. 

Which we then check against:

$$
f_1(r_1) \ mod \ 10 = f_2(0) + f_2(1) \ mod \ 10 \\
(4(4) - 1) \ mod \ 10 = (7 \cdot 0 + 4 + 7 \cdot 1 + 4) \ mod \ 10 \\
(15) \ mod \ 10 = (15) \ mod \ 10 \\
$$

This round passes.

Becuase we are working with three variables we will cycle through one more time.

$$
f(4, 4, X_3) =4  \cdot (4 + X_3) - (4 \cdot X_3) = 16 - 12X_3 \\
$$

Which results in $f_3 = 16 - 12X_3$.

$$
f_2(r_2) \ mod \ 10 = f_3(0) + f_3(1) \ mod \ 10 \\
(4 \cdot 4 + 4) \ mod \ 10= (16 - 12 \cdot 0) + (16 -12 \cdot 1)\ mod \ 10 \\
(20) \ mod \ 10 = (20) \ mod \ 10
$$

All checks pass and we can proceed to the final round!

#### Round 6:

In the final round, $\mathcal{P}$ sends the univeriate polynomial:

$$
f_n(X_n) = f(r_1, ..., r_{n-1}, X_n)
$$

$\mathcal{V}$ checks that $f_n$ is of degree at most $d \le deg_n(d)$. 

$\mathcal{V}$ checks that $f_{n-1}(X_{n-1}) = f_n(0) + f_n(1)$.

Finally, $\mathcal{V}$ chooses a random $r_n \in \mathbb{F}$ and evaluates $f(r_1,...,r_n)$ via an oracle query to $f$.

If $f_v(r_v)= f(r_1,...,r_v)$, $\mathcal{V}$ accepts. 

Let's use our toy example to show how this final check would work.  Becuase the final polynomial is $f_3$ that is what $\mathcal{P}$ will send to $\mathcal{V}$.

We then choose a random $r_v \in \mathbb{F}$ (which will remain as $r_v = 4$ for our example).

$$
f(4,4,4) = f_3(4) \\
 (4 \cdot (4 + 4) - (4 \cdot 4) = (16 - 12 \cdot 4) \\ 
 (-32) \ mod \ 10 = (-32) \ mod \ 10
$$

And so our Sumcheck passed.  We now know enough to accept the claim from $\mathcal{P}$ that $H$ was computed correctly. 

## Protocol Costs

The cost of running the Sumcheck protocol is determined by the number of $n$ variables in $f$.  For each variable, Sumcheck will conduct a single round.  The cost of the protocol can be measured in terms of the cost of the $\mathcal{P}$ to $\mathcal{V}$ communication, as well as in terms of the cost incurred by each algorithm running individually. 

#### Communication Cost:

For $v$ rounds of the protocol, to total prover to verifier communication costs can be calculated as:

$$
O(\sum_{i=1}^{v} deg_i(f))
$$

#### Verifier Time:

For $v$ rounds of protocol, with $T$ being the cost of the oracle query to $f$, the verifier time can be calculated as:

$$
O(v + \sum_{i=1}^{v} deg_i(f)) + T
$$

#### Prover Time:

$$
O(\sum_{i=1}^{v} deg_i(f) \cdot 2^{v-i} \cdot T)
$$

However, if the degree of $f$ is $deg_i(f) = O(1)$ for all $i$, then the prover time is just:

$$
O(2^v \cdot T)
$$

## Reference

[G22] Sam Green "Introduction to the Sum-Check Protocol" 2022                        https://semiotic.ai/articles/sumcheck-tutorial/

[LFKN92] Carsten Lund, Lance Fortnow, Howard Karloff, and Noam Nisan. Algebraic methods for inter-active proof systems. J. ACM, 39:859–868, October 1992.
https://dl.acm.org/doi/pdf/10.1145/146585.146605

[S21] Gabriel Soule "GKR Lectures: The Sum-Check Protocol" 2021 https://drive.google.com/file/d/1tU50f-IpwPdCEJkZcA7K0vCr7nwwzCLh/view?pli=1

[T17] Justin Thayler "The Sum-Check Protocol (lecture notes)" 2017 https://people.cs.georgetown.edu/jthaler/sumcheck.pdf

[T20] Justin Thayler "The Unreasonable Power of the Sum-Check  Protocol" 2020
https://zkproof.org/2020/03/16/sum-checkprotocol

[T23] Justin Thayler "Proofs, Arguments, and Zero-Knowledge" 2023 https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.pdf
