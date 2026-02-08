import PostgREST from 'https://raw.githubusercontent.com/Starscade/pgrst-js/refs/heads/main/dist/pgrst.esm.js'

const SQL = new PostgREST({
	pgrst_url: Deno.env.get('PGRTS_HOST'),
	schema: Deno.env.get('PGRTS_SCHEMA'),
})

const result = await SQL.query(Deno.args[0])

console.log(
	JSON.stringify(result),
)
