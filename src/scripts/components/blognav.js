import React from 'react';
import { Router, Route, browserHistory, Link } from 'react-router';

export default function BlogNav() {
	return (
		<div>
			<nav>
				<div className="wrapper">
					<div className="dashboard__logoContainer">
						<img className="mainLogo" src="../../assets/logo_white.png" alt="Blog Simply Logo in White"/>
						<p>A Simple Way to Blog</p>
					</div>
					<div className="mainNavigation__linksContainer">
						<Link to="/blog"className="dashboard__buttonNav">BLOG</Link>
					</div>
				</div>
			</nav>
		</div>
	)
}