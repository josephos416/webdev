// src/user-profiles.ts
import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { Profile } from "./models/profile";
import { serverPath } from './rest';
@customElement("user-profile")
export class UserProfileElement extends LitElement {
  @property()
  path: string = "";

  @state()
  profile?: Profile;

  render() {
    // fill this in later
    return html`
        <div class="user-profile">
            <h2>User Profile</h2>
            <p><b>Nickname:</b> ${this.profile?.nickname}</p>
            <p><b>User ID:</b> ${this.profile?.userid}</p>
            <p><b>User ID:</b> ${this.profile?.city}</p>
            <p><b>User ID:</b> ${this.profile?.airports}</p>

        </div>
    `;
  }
  
  _fetchData(path: string) {
    fetch(serverPath(path))
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      })
      .then((json: unknown) => {
          if (json) this.profile = json as Profile;
      })};

      // in class UserProfileElement
  connectedCallback() {
    if (this.path) {
      this._fetchData(this.path);
    }
    super.connectedCallback();
  };

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name === "path" && oldValue !== newValue && oldValue) {
            this._fetchData(newValue);
        }
        super.attributeChangedCallback(name, oldValue, newValue);
    };

 /* static styles = css`...`;*/
}



@customElement("user-profile-edit")
export class UserProfileEditElement extends UserProfileElement {
  render() {
    return html`<form @submit=${this._handleSubmit}>
    <label for="nickname">Nickname:</label>
    <input type="text" id="nickname" name="nickname"}"><br><br>
    
   
    <label for="city">City:</label>
    <input type="text" id="city" name="city" "><br><br>
    
    <label for="airports">Airports (comma separated):</label>
    <input type="text" id="airports" name="airports""><br><br>

    <label for="userid">User ID:</label>
    <input type="text" id="userid" name="userid"><br><br>
    
    <button type="submit">Submit</button>
    </form> `;
  }

  /*static styles = [...UserProfileElement.styles, css`...`];*/

  _handleSubmit(ev: Event) {
    console.log("we in handle submit");
    ev.preventDefault(); // prevent browser from submitting form data itself

    const target = ev.target as HTMLFormElement;
    const formdata = new FormData(target);
    const entries = Array.from(formdata.entries())
      .map(([k, v]) => (v === "" ? [k] : [k, v]))
      .map(([k, v]) =>
        k === "airports"
          ? [k, (v as string).split(",").map((s) => s.trim())]
          : [k, v]
      );
    const json = Object.fromEntries(entries);
    this._putData(json);
  }

    _putData(json: Profile) {
      fetch(serverPath(this.path), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(json)
      })
        .then((response) => {
          if (response.status === 200) return response.json();
          else return null;
        })
        .then((json: unknown) => {
          if (json) this.profile = json as Profile;
        })
        .catch((err) =>
          console.log("Failed to PUT form data", err)
        );
    }
  }

  
