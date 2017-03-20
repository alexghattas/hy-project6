import React from 'react';
import { Router, Route, browserHistory, Link } from 'react-router';

export default function BlogNav() {
	return (
		<div>
			<nav>
				<div className="wrapper">
					<div className="dashboard__logoContainer">
						<img className="mainLogo" src="../../assets/logo_white.png" alt="Blog Simply Logo in White"/>
					</div>
					<div className="mainNavigation__linksContainer">
						<p>A Simple Way to Blog</p>
					</div>
				</div>
			</nav>
		</div>
	)
}