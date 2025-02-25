'use client';
import React, { useEffect, useState , FormEvent} from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

import "./App.css";
import particlesOptions from "./particles.json";
import { ISourceOptions } from "@tsparticles/engine";

function App() {
    const [ init, setInit ] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine: Engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);



    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      // Handle login logic here, such as validating inputs and making API calls
      console.log('Logging in with:', username, password);
    };




    return (
        <div className="App">


 
    {init && (
                <Particles
                    options={particlesOptions as unknown as ISourceOptions}
                />
            )}
    
    <form onSubmit={handleLogin} autoComplete="off">
  <h3>เข้าสู่ระบบ</h3>

  <label htmlFor="username">Username</label>
  <input
    type="text"
    placeholder="Email or Phone"
    id="username"
    value={username}
    autoComplete="off" // ปิดการแนะนำสำหรับช่อง username
    onChange={(e) => setUsername(e.target.value)}
  />

  <label htmlFor="password">Password</label>
  <input
    type="password"
    placeholder="Password"
    id="password"
    value={password}
    autoComplete="new-password" // ปิดการแนะนำ password
    onChange={(e) => setPassword(e.target.value)}
  />

  <button type="submit">Log In</button>
</form>


        </div>
    );
}

export default App;
