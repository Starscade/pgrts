import PostgREST from '../esm/postgrets.esm.js'

const SQL = new PostgREST({
	pgrst_url: Deno.env.get('PGRST_HOST'),
	schema: Deno.env.get('PGRST_SCHEMA'),
})

const result = await SQL.query(Deno.args[0])

console.log(
	JSON.stringify(result),
)
