export default class {
	constructor({
		pgrst_url = 'localhost:3000',
		schema = 'public',
		jwt = '',
	} = {}) {
		this.pgrst_url = pgrst_url
		this.schema = schema
		this.jwt = jwt
	}

	async query(
		query_string = '',
		query_body = null,
		query_operation = 'INSERT',
	) {
		let response = null
		if (query_body) {
			const heads = {
				'Content-Type': 'application/json',
				'Content-Profile': this.schema,
				'Accept': 'application/vnd.pgrst.object+json',
				'Prefer': 'resolution=merge-duplicates, return=representation',
			}
			if (this.jwt) {
				heads['Authorization'] = 'Bearer ' + this.jwt
			}
			let fetch_obj = {
				method: 'POST',
				headers: heads,
				body: JSON.stringify(query_body),
			}
			if (query_operation) {
				switch (query_operation.toUpperCase()) {
					case 'DELETE':
						fetch_obj.method = 'DELETE'
						break
					case 'UPDATE':
						fetch_obj.method = 'PATCH'
						break
				}
			}
			response = await fetch(
				this.pgrst_url + '/' + query_string,
				{ ...fetch_obj },
			)
		} else {
			const heads = {
				'Accept-Profile': this.schema,
			}
			if (this.jwt) {
				heads['Authorization'] = 'Bearer ' + this.jwt
			}
			response = await fetch(
				this.pgrst_url + '/' + query_string,
				{
					headers: heads,
				},
			)
		}
		return await response.json()
	}
}
