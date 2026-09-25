// retrieves equivariant betti tables from GitHub repository (allows access as soon as I calculate them)

import { Octokit, App } from "https://esm.sh/octokit";
const octokit = new Octokit({ auth: `my_secret`});

const data = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
    owner: 'LiberMagnum',
    repo: 'grobnercrystals_stabilization',
    path: 'msv-betti-data/21.html',
    headers: {
        'X-GitHub-Api-Version': '2026-03-10'
    }
})
console.log(data);
console.log(atob(data.data.content));

$("#betti-container").html(atob(data.data.content));

$(document).ready(function(){
    
});