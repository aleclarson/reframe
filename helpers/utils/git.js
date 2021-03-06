const assert_internal = require('reassert/internal');
const simple_git = require('simple-git/promise');
const git_state = require('git-state');
const path = require('path');

module.exports = {
    hasDirtyOrUntrackedFiles,
    isRepository,

    gitIsAvailable,
    gitIsConfigured,

    init,
    commit,
    push,
    addRemote,
    fetch,
    reset,
    log,
    checkoutReadme,
    branch,
    show,
};

function hasDirtyOrUntrackedFiles({cwd}) {
    const {promise, resolvePromise, rejectPromise} = genPromise();
    git_state.check(cwd, (err, result) => {
        if( err ) {
            rejectPromise(err);
            return;
        }
        const ret = result.dirty!==0 || result.untracked!==0;
        resolvePromise(ret);
    });
    return promise;
}

async function isRepository({cwd}) {
    const gitP = simple_git(cwd);
    return await gitP.checkIsRepo();
}

function genPromise() {
    let resolvePromise;
    let rejectPromise;
    const promise = new Promise((resolve, reject) => {resolvePromise=resolve;rejectPromise=reject});
    return {promise, resolvePromise, rejectPromise};
}

function gitIsAvailable() {
    const child_process = require('child_process');
    const {exec} = child_process;

    const {promise, resolvePromise} = genPromise();

    exec(
        'git --version',
        {},
        (err, stdout, stderr) => {
            resolvePromise(err===null);
        }
    );

    return promise;
}

function gitIsConfigured({cwd}) {
    const child_process = require('child_process');
    const {exec} = child_process;

    const {promise, resolvePromise} = genPromise();

    exec(
        'git config -l',
        {},
        (err, stdout, stderr) => {
            if( err!==null ) {
                rejectPromise(err);
                return;
            }
            if( stderr ) {
                rejectPromise(stderr);
                return;
            }

            const lines = stdout.split('\n');

            const hasUserName = lines.some(line => line.startsWith('user.name'));
            const hasUserEmail = lines.some(line => line.startsWith('user.email'));

            resolvePromise(hasUserName && hasUserEmail);
        }
    );

    return promise;
}

async function init({cwd}) {
    assert_internal(cwd);
    await simple_git(cwd).init();
}

async function commit({cwd, message}) {
    assert_internal(cwd);
    const gitP = simple_git(cwd);
    await gitP.add('./*');
    const ret = await gitP.commit(message);
    return ret;
}

async function show({cwd, args}) {
    assert_internal(cwd);
    const gitP = simple_git(cwd);
    return await gitP.show(args);
}

async function push({cwd, remote, branch}) {
    assert_internal(cwd);
    assert_internal(remote);
    assert_internal(branch);
    const gitP = simple_git(cwd);
    await gitP.push(remote, branch);
}

async function addRemote({cwd, name, remote}) {
    assert_internal(cwd);
    assert_internal(remote);
    assert_internal(name);
    const gitP = simple_git(cwd);
    const remotes = await gitP.getRemotes();
    if( remotes.find(remote => remote.name===name) ) {
        return;
    }
    const ret = await gitP.addRemote(name, remote);
}

async function fetch({cwd, remote, branch}) {
    assert_internal(cwd);
    assert_internal(remote);
    assert_internal(branch);
    const gitP = simple_git(cwd);
    const ret = await gitP.fetch(remote, branch);
}

async function reset({cwd, args}) {
    assert_internal(cwd);
    const gitP = simple_git(cwd);
    const ret = await gitP.reset(args);
}

async function branch({cwd, args}) {
    assert_internal(cwd);
    const gitP = simple_git(cwd);
    const ret = await gitP.branch(args);
}

async function log({cwd, args}) {
    assert_internal(cwd);
    const gitP = simple_git(cwd);
    const ret = await gitP.log(args);
    return ret;
}

async function checkoutReadme({cwd}) {
    assert_internal(cwd);
    const readmePaths = ['readme.md', 'README.md'].map(filename => path.resolve(cwd, './'+filename));

    for(readmePath of readmePaths) {
        try {
            await checkout({cwd, args: [readmePath], silent: true});
            return readmePath;
        } catch( err ) {}
    }

    return null;
}

async function checkout({cwd, args, silent}) {
    assert_internal(cwd);
    let gitP = simple_git(cwd);
    if( silent ) {
        gitP = gitP.silent(true);
    }
    await gitP.checkout(args);
}
