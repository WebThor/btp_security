# Task 2: Inspecting the JWT Token for the Jedi Archives

## Introduction to the JWT Token  
JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It is commonly used in OAuth2 and OpenID Connect (OIDC) flows, such as in the SAP BTP Cloud Foundry environment. JWTs are signed and optionally encrypted tokens that include claims like user information, scopes, and the token issuer.

In our BTP application, the SAP XSUAA service issues JWTs when users authenticate. These tokens are securely passed between services to validate permissions and manage access control.

---

## Goal of Task 2

You will use the `/jwt` endpoint implemented in the backend to retrieve your JWT, and then you will inspect the token's contents using [JWT Decoder](https://jwt.io/). By analyzing the JWT, you will identify key information, such as the token issuer, scopes, and user identity.

Additionally, you will **draw the JWT token flow** based on the decoded content to understand how authentication and authorization work.

---

## Steps

1. **Retrieve the JWT**  
   Visit the following endpoint for your BTP application backend to fetch the JWT:  
   ```
   https://frontendgroupxx.cfapps.us10-001.hana.ondemand.com/jwt
   ```
   Replace `groupxx` with your unique group number.

   - Ensure you are logged in and have sufficient permissions (`force_admin` role) to access the endpoint.
   - Copy the JWT token provided in the response.

2. **Inspect the JWT on jwt.io**  
   Go to [SAP JWT Decoder](https://jwt.io/) and paste the JWT token into the **"Encoded"** section.

   - jwt.io will automatically decode the token and display the **Header**, **Payload**, and **Signature**.

3. **Analyze the Decoded JWT**  
   Examine the **Payload** (the middle section) for the following fields:
   
   | Claim              | Description                                               |
   |---------------------|-----------------------------------------------------------|
   | `iss`              | The **Issuer** of the token. Identifies the XSUAA service.|
   | `sub`              | The **Subject** of the token. Usually your user ID.       |
   | `scope`            | Lists the scopes (permissions) granted to the user.       |
   | `exp`              | The **Expiration Time** of the token (in Unix time).      |
   | `client_id`        | The client application ID used to obtain the JWT.         |
   | `user_name`        | The username or email of the authenticated user.          |

4. **Document Your Observations**  
   Answer the following questions based on your JWT inspection:
   - What is the `iss` (Issuer) of your JWT?  
   - What `scope` values are listed in the token? Are these aligned with the roles assigned to you?  
   - When does the token expire (convert the `exp` value to a readable date and time)?  
   - What is your `user_name` or `sub` value in the token?  

5. **Reflect on Your Permissions**  
   - Are the permissions (scopes) in your JWT sufficient to perform actions like adding or deleting hardware items?  
   - If not, revisit the [BTP Cockpit](https://cockpit.hanatrial.ondemand.com/) and assign yourself the appropriate **Role Collections** (`JediOrder`, `SithEmpire`, etc.).

6. **Draw the JWT Token Flow**  
   Based on the decoded JWT content and your understanding, create a flow diagram to represent the following:
   - **Token Issuance**: Identify the issuer (`iss`) of the JWT.
   - **Token Recipient**: Who the token is intended for (`aud` - Audience).
   - **User Information**: Highlight the subject (`sub` or `user_name`) of the token.
   - **Scopes**: Include the granted permissions (`scope` values).
   - **Expiration**: Indicate when the token expires (`exp`).
   - **Process Flow**: Show the flow of the token from the identity provider (XSUAA) to the backend application.

---

## Example of a Decoded JWT

After decoding a JWT, you might see the following **Payload**:

```json
{
  "iss": "https://<subdomain>.authentication.sap.hana.ondemand.com",
  "sub": "user123@galacticalliance.com",
  "aud": "product-list",
  "scope": [
    "product-list.force_read",
    "product-list.force_edit"
  ],
  "exp": 1714323456,
  "iat": 1714319856,
  "client_id": "sb-product-list-client",
  "user_name": "user123@galacticalliance.com"
}
```

---

## Task Summary

1. Visit `/jwt` to retrieve your JWT token.
2. Use [SAP JWT Decoder](https://jwt.io/) to decode and inspect the token.
3. Analyze the token fields and answer the provided questions.
4. Draw a flow diagram of the JWT token flow based on its decoded content.
5. Ensure your scopes (permissions) are aligned with your assigned roles.

Once you have successfully inspected the JWT and visualized the token flow, continue with [Task 3](./Task3.md).

---

