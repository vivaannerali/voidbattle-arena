import React from 'react';
import { Link } from 'react-router-dom';
export default function PublicNavigation(){
 return <nav className="public-navigation" aria-label="Site navigation"><Link to="/">Play</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link></nav>;
}