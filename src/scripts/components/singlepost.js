import React from 'react';
import { Router, Route, browserHistory, Link } from 'react-router';
import BlogNav from './blognav.js';

export default class SinglePost extends React.Component {
	constructor() {
			super()
			this.state = {
				loggedInSinglePost: false,
				editing: false,
				post: {}
			};
			this.save = this.save.bind(this);
		}
	componentDidMount() {
		firebase.auth().onAuthStateChanged((user) => {
		if(user) {
			this.setState({
				loggedInSinglePost: true
			})
		}
		if(user === null || user) {
			firebase.database().ref().on('value', (res) => {
				const userPostKey = this.props.params.blog_key;
				const userData = res.val();
				this.setState({
					post: userData[userPostKey]
				})
				});
			}
		})
	}
	save(e) {
		e.preventDefault();
		const dbRef = firebase.database().ref(this.props.params.blog_key)
		dbRef.update({
			title: this.postTitle.value,
			content: this.postContent.value,
			author: this.postAuthor.value,
			date: this.postDate.value
		})
		this.setState({
			editing: false
		})
	}
	render() {
		let editingTemp = (
			<div>
				<div>
					<section className="singlePost__blogHero" style={{
						backgroundImage: 'url(' + this.state.post.photo + ')',
						backgroundSize: 'cover',
						backgroundPosition: 'center center'
					}}>
						<div className="singlePost__blogHero--title">
							<h1>{this.state.post.title}</h1>
							<h4 className="singlePost__mainContent--info">
								Written by <span>{this.state.post.author}</span> on <span>{this.state.post.date}</span>
							</h4>
						</div>
					</section>
					<div className="wrapper">
						<section className="singlePost__mainContent">
							<p>{this.state.post.content}</p>
						</section>
					</div>
				</div>
			</div>
		)
		if (this.state.loggedInSinglePost) {
			editingTemp = (
				<div>
					<div className="singlePost__hoverEdit">
						<div className="singlePost__hoverEdit--container">
							<button className="singlePost__hoverEdit--button" onClick={() => this.setState({editing: true})}>Click to Edit Post</button>
							<Link to="/" className="singlePost__hoverEdit--button">Back to Dashboard</Link>
						</div>
					</div>
					<div>
						<section className="singlePost__blogHero" style={{
							backgroundImage: 'url(' + this.state.post.photo + ')',
							backgroundSize: 'cover',
							backgroundPosition: 'center center'
						}}>
							<div className="singlePost__blogHero--title">
								<h1>{this.state.post.title}</h1>
								<h4 className="singlePost__mainContent--info">
									Written by <span>{this.state.post.author}</span> on <span>{this.state.post.date}</span>
								</h4>
							</div>
						</section>
						<div className="wrapper">
							<section className="singlePost__mainContent">
								<p>{this.state.post.content}</p>
							</section>
						</div>
					</div>
				</div>
			)
		} 
		if (this.state.editing && this.state.loggedInSinglePost) {
			editingTemp = (
				<div>
					<form onSubmit={this.save}>
						<div className="wrapper__dashboard--list singlePost__editing--form">
							<h4>Please make your changes, then click "Done Editing" at bottom</h4>
							<div className="singlePost__editing--topRow">
								<input type="text" defaultValue={this.state.post.author} name='author' ref={ref => this.postAuthor = ref}/>
								<input type="date" defaultValue={this.state.post.date} name='date' ref={ref => this.postDate = ref}/>
							</div>
							<div className="singlePost__editing--title">
								<input type="text" defaultValue={this.state.post.title} name='title' ref={ref => this.postTitle = ref}/>
							</div>
							<div className="singlePost__editing--content">
								<textarea rows="15" type="text" defaultValue={this.state.post.content} name='content' ref={ref => this.postContent = ref}/>
							</div>
						</div>
						<div className="singlePost__hoverEdit">
							<div className="singlePost__hoverEdit--container">
							<input className="singlePost__hoverEdit--button" type="submit" value="Done Editing"/>
							</div>
						</div>
					</form>
				</div>
			)
		}
		return (
			<div>
				<BlogNav />
				{editingTemp}
			</div>
		)
	}
}
