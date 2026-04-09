/**
 * A plug-and-play PostgREST ESM module.
 * @module
 */

/**
 * @param pgrst_url The PostgREST server URL. (Defaults to "http://localhost:3000".)
 * @param schema A comma-separated string of PostgreSQL schemas to connect to. (Defaults to "public".)
 * @param jwt Specify client JWT to use for authentication. (Defaults to a blank string.)
 */
export default class {
	pgrst_url: string
	schema: string
	jwt: string

	constructor({
		pgrst_url = 'http://localhost:3000',
		schema = 'public',
		jwt = '',
	} = {}) {
		this.pgrst_url = pgrst_url
		this.schema = schema
		this.jwt = jwt
	}


	/**
	 * @param query_string Any PostgREST-style SQL query.
	 * @param query_body Values for INSERT/UPDATE statements. (Defaults to null.)
	 * @param query_operation Determines CRUD method. (Only used if `query_body` is not null. Defaults to "INSERT".)
	 * @returns An array of JSON objects representing queried PostgreSQL records.
	 */
	async query(
		query_string = '',
		query_body = null,
		query_operation = 'INSERT',
	): Promise<void> {
		let response = null
		if (query_body) {
			const heads: Record<string, string> = {
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
			const heads: Record<string, string> = {
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
