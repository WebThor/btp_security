# Task 1: Explanation of the XSUAA Configuration for the Jedi Archives

## Key Components of XSUAA Configuration

The [XSUAA](https://learning.sap.com/learning-journeys/discover-sap-business-technology-platform/illustrating-sap-authorization-and-trust-management-service-xsuaa-_b9fde282-4cff-4dca-b146-7c8f8dde9955) service within SAP BTP manages the authorization flow among users, identity providers, and applications/services. It is an SAP-developed component tailored for SAP BTP, built upon the [Cloud Foundry](https://www.cloudfoundry.org/)'s open-source [UAA](https://docs.cloudfoundry.org/concepts/architecture/uaa.html), an OAuth provider handling authentication and authorization. XSUAA extends UAA with SAP-specific features and is essential for granting business users permissions through roles within SAP BTP, Cloud Foundry.

XSUAA does not store user data but requires a trusted connection to an identity provider, such as the SAP ID Service (which is the Provider used in the BTP Trail environment) or another integrated corporate identity provider, facilitated through SAP Cloud Identity Services—Identity Authentication Service ([IAS](https://help.sap.com/docs/cloud-identity-services)). It serves as the central infrastructure for business user authentication and authorization in SAP BTP’s Cloud Foundry environment, enriched with a service broker, multi-tenancy, management APIs, and minor enhancements by SAP.

Using OAuth, XSUAA authenticates between services and connects to the identity provider. OAuth is an open standard for managing authorization without sharing passwords, using tokens to authenticate identities. These tokens, called JWT (JSON Web Tokens), securely transmit information between parties, ensuring safe authentication and access rights management within the OAuth framework.

#### XSUAA Configuration

The SAP XSUAA configuration is a crucial component for managing user authorization and access control within any SAP application. This configuration is typically defined in a `xs-security.json` file and includes various elements that outline permissions and roles necessary for the application's secure and efficient operation. In our hardware store, the configuration file can be found at `btp_security/security/xs-security.json`. A detailed explanation of the hardware store's XSUAA can be found here. 

## XSUAA Configuration of the Hardware Store

```json
{
	"xsappname": "product-list",
	"tenant-mode": "dedicated",
	"scopes": [
	  {
		"name": "$XSAPPNAME.force_read",
		"description": "Allows Jedi to read the Holocrons."
	  },
	  {
		"name": "$XSAPPNAME.force_edit",
		"description": "Allows Sith to manipulate the archives."
	  },
	  {
		"name": "$XSAPPNAME.force_admin",
		"description": "Allows the Emperor to take control."
	  },
	  {
		"name": "$XSAPPNAME.force_guest",
		"description": "Allows Rebels to access public transmissions."
	  }
	],
	"role-templates": [
	  {
		"name": "jedi_knight",
		"description": "Access to Jedi knowledge.",
		"scope-references": [
		  "$XSAPPNAME.force_read"
		]
	  },
	  {
		"name": "sith_lord",
		"description": "Ability to alter the Jedi archives.",
		"scope-references": [
		  "$XSAPPNAME.force_edit"
		]
	  },
	  {
		"name": "emperor",
		"description": "Full control over the Galactic Empire.",
		"scope-references": [
		  "$XSAPPNAME.force_admin"
		]
	  },
	  {
		"name": "rebel_agent",
		"description": "Access to public data of the Rebel Alliance.",
		"scope-references": [
		  "$XSAPPNAME.force_guest"
		]
	  }
	],
	"role-collections": [
	  {
		"name": "JediOrder",
		"description": "Members of the Jedi Order with reading privileges.",
		"role-template-references": [
		  "$XSAPPNAME.jedi_knight"
		]
	  },
	  {
		"name": "SithEmpire",
		"description": "Sith with the ability to edit archives.",
		"role-template-references": [
		  "$XSAPPNAME.sith_lord"
		]
	  },
	  {
		"name": "ImperialCommand",
		"description": "Administrators with full control.",
		"role-template-references": [
		  "$XSAPPNAME.emperor"
		]
	  },
	  {
		"name": "RebelAlliance",
		"description": "Rebels with access to public information.",
		"role-template-references": [
		  "$XSAPPNAME.rebel_agent"
		]
	  }
	],
	"oauth2-configuration": {
	  "redirect-uris": [
		"https://*.cfapps.us10-001.hana.ondemand.com/**"
	  ]
	}
}
```

### Explanation of the XSUAA Configuration

#### 1. General Information
- **`xsappname`**: The unique name of the application, which is `product-list`.
- **`tenant-mode`**: Indicates how the application handles tenants. It is set to `dedicated`, meaning each tenant has its own isolated instance.

---

#### 2. Scopes

Scopes define specific permissions within the application. These scopes are referenced in role templates and determine what actions users can perform.

- **`$XSAPPNAME.force_read`**: Allows Jedi to read the Holocrons, granting access to viewing data. This is the scope you have assigned yourself during the initial deployment process of the BTP app.
- **`$XSAPPNAME.force_edit`**: Allows Sith to manipulate the archives, enabling editing capabilities.
- **`$XSAPPNAME.force_admin`**: Allows the Emperor to take control, granting administrative permissions.
- **`$XSAPPNAME.force_guest`**: Allows Rebels to access public transmissions, providing limited public access.

---

#### 3. Role Templates

Role templates combine individual scopes into roles that can be assigned to users.

- **`jedi_knight`**:
  - **Description**: Grants access to Jedi knowledge.
  - **Scope Reference**: `$XSAPPNAME.force_read`

- **`sith_lord`**:
  - **Description**: Allows Sith to alter the Jedi archives.
  - **Scope Reference**: `$XSAPPNAME.force_edit`

- **`emperor`**:
  - **Description**: Provides full control over the Galactic Empire.
  - **Scope Reference**: `$XSAPPNAME.force_admin`

- **`rebel_agent`**:
  - **Description**: Grants access to public transmissions of the Rebel Alliance.
  - **Scope Reference**: `$XSAPPNAME.force_guest`

---

#### 4. Role Collections

Role collections group role templates together for easier assignment to users.

- **`JediOrder`**:
  - **Description**: Members of the Jedi Order with reading privileges.
  - **Role Template Reference**: `$XSAPPNAME.jedi_knight`

- **`SithEmpire`**:
  - **Description**: Sith with the ability to edit archives.
  - **Role Template Reference**: `$XSAPPNAME.sith_lord`

- **`ImperialCommand`**:
  - **Description**: Administrators with full control.
  - **Role Template Reference**: `$XSAPPNAME.emperor`

- **`RebelAlliance`**:
  - **Description**: Rebels with access to public information.
  - **Role Template Reference**: `$XSAPPNAME.rebel_agent`

---

#### 5. OAuth2 Configuration

The `oauth2-configuration` specifies settings for OAuth2 authentication.

- **`redirect-uris`**: Defines the allowed redirect URIs for OAuth2 authentication. The wildcard pattern allows any subdomain of `cfapps.us10-001.hana.ondemand.com`:

  - `"https://*.cfapps.us10-001.hana.ondemand.com/**"`

---

## Example User Flows

1. **Jedi Role (JediOrder)**:
   - A user assigned to the `JediOrder` role collection inherits the `jedi_knight` role template.
   - This allows them to read Holocrons through the scope `$XSAPPNAME.force_read`. This is the role you initially assigned yourself during the deployment process.

2. **Sith Role (SithEmpire)**:
   - A user assigned to the `SithEmpire` role collection inherits the `sith_lord` role template.
   - This allows them to edit archives through the scope `$XSAPPNAME.force_edit`.

3. **Emperor Role (ImperialCommand)**:
   - A user assigned to the `ImperialCommand` role collection inherits the `emperor` role template.
   - This allows them full administrative control through the scope `$XSAPPNAME.force_admin`.

4. **Rebel Role (RebelAlliance)**:
   - A user assigned to the `RebelAlliance` role collection inherits the `rebel_agent` role template.
   - This allows them to view public transmissions through the scope `$XSAPPNAME.force_guest`.

---

## Task 1

 1. Go to the frontend of the BTP application you just deployed: `https://frontendGroupxx.cfapps.us10-001.hana.ondemand.com` (where `xx` is your unique value).
 2. Try to add a new Hardware Item and delete an existing one. Are you able to do so? Why or why not?
 3. If you cannot add or delete items, fix it by assigning yourself the necessary Role Collections in the BTP Cockpit.  [SAP BTP Cockpit](https://cockpit.hanatrial.ondemand.com/)

**Hint**: You did this already with the JediOrder role collection at this [Step](../README.md#step-6-assign-necessary-roles). You now need to assign yourself the other star wars named role collections.

If you are now able to add and delete items from the hardware store, you can continue with [Task 2](./Task2.md)

