# Auto-ID (Proof of Concept)

This repository serves as a proof of concept meant to handle Auto-IDs. It includes features for issuing, copying, and managing Auto-IDs, as well as integration options for different applications.

For every Auto-ID, an Auto-Score can be attached, serving as a Proof of Humanity for the issued identity via Zero Knowledge Proofs and [Reclaim Protocol](https://www.reclaimprotocol.org/).

Additionally, if you have issued an Auto-Score, you will be able to link your Auto-ID with your Discord account. This will grant you access to permissioned channels in our Discord server.

# What is an Auto-ID?

Auto-ID is an identity system built on the Autonomys Network, utilizing X509 certificates for secure identification. Each Auto-ID consists of a certificate that is signed by the user's keypair, ensuring authenticity. Users can possess multiple Auto-IDs, which allows them to manage distinct identities and associated claims separately. Claims are verifiable statements about an individual that can be validated.

The Auto-Score is derived from these verifiable claims and represents a score that reflects the probability of an identity being human.

## How it works?

1. Create an encrypted keypair by setting up a password.

2. Click on the "New" button and then select "Issue Auto ID."

3. Once you have your Auto-ID, you can:

   - Issue an Auto-Score: Create a Zero Knowledge Proof claim using [Reclaim Protocol](https://www.reclaimprotocol.org/) showing that you have a trait of personhood (e.g., having an Uber account). This will issue an Auto-Score attached to your Auto-ID; the more claims you generate, the better your Auto-Score will be.

   - Link to your Discord account: There will be some permissioned channels in [our Discord server](https://discord.com/channels/864285291518361610/969329076378697808) that only users with a certain Auto-Score above a specified threshold will be able to access.

## Installation

To install the project, clone the repository and run the following commands:

Using npm:

```
npm i
npm run dev
```

Using yarn:

```
yarn
yarn dev
```
