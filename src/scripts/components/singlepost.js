import React from 'react';

export default class SinglePost extends React.Component {
	constructor() {
			super()
			this.state = {
				editing: false,
				post: {}
			};
			this.save = this.save.bind(this);
		}
		componentDidMount() {
			firebase.database().ref().on('value', (res) => {
				const userPostKey = this.props.params.blog_key;
				const userData = res.val();
				this.setState({
					post: userData[userPostKey]
				})
				this.setState({})
			});
		}
	save(e) {
		e.preventDefault();
		
		const dbRef = firebase.database().ref(this.props.params.blog_key)

		dbRef.update({
			title: this.postTitle.value,
			content: this.postContent.value
		})

		this.setState({
			editing: false
		})
	}
	render() {
		let editingTemp = (
			<div>
				<h1>{this.state.post.title}</h1>
				<p>{this.state.post.content}</p>
			</div>
		)

		if (this.state.editing) {
			editingTemp = (
				<form onSubmit={this.save}>
					<div>
						<input type="text" defaultValue={this.state.post.title} name='title' ref={ref => this.postTitle = ref}/>
					</div>
					<div>
						<input type="text" defaultValue={this.state.post.content} name='content' ref={ref => this.postContent = ref}/>
					</div>
					<input type="submit" value="Done Editing"/>
				</form>
			)
		}

		return (
			<div>
				<i className="fa fa-pencil" onClick={() => this.setState({editing: true})}></i>
				{editingTemp}
			</div>
		)
	}
}