class Decode {
    constructor(act_sentence, coded_sentence) {
        // this.sent = Array.isArray(act_sentence) ? act_sentence.join("").split(" ").join("") : act_sentence.split(" ").join("");
        this.sent = Array.isArray(act_sentence) ? act_sentence.join("") : act_sentence;
        // this.code = Array.isArray(coded_sentence) ? coded_sentence.join("").split(" ").join("") : coded_sentence.split(" ").join("");
        this.code = Array.isArray(coded_sentence) ? coded_sentence.join("") : coded_sentence;
        // This is joining whatever info we've got
        // this.tot = this.sent.length; 
        this.pop = [];
        this.it = 0;
        this.items = "abcdefghijklmnopqrstuvwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ ,.!?".split("");
        this.run;
    }
    shuffle(a) {
        for (let i = a.length - 1; i > 0; --i) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    join_an_obj(obj) {
        return Object.values(obj).join("");
    } 
    make_key(str) {
        // const items = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".split("");
        let key = {};
        // console.log(ne);
        for (let i = 0; i < this.items.length; ++i) {
            key[this.items[i]] = str[i];
        }
        return key;
    }
    random_key() {
        // const items = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm".split("");
        let ne = this.shuffle(this.items.slice());
        // key = {};
        // console.log(ne);
        return this.make_key(ne);
    }
    decode(key = this.pop[0], phrase = this.code) { // KEY, CODED SENTENCE; output: ATTEMPT OF ACTUAL PHRASE
        let ans = "";
        for (let i = 0; i < phrase.length; ++i) {
            ans+=key[phrase[i]];
            // console.log(key[phrase[i]], ans);
        }
        // console.log("ANS", ans);
        return ans;
    }
    translate(phrase = this.code, key = this.pop[0]) {
        console.log(key);
        let ans = "";
        for (let i = 0; i < phrase.length; ++i) {
            ans += key[phrase[i]];
            // console.log(key[phrase[i]], ans);
        }
        // console.log("ANS", ans);
        return ans;
    }
    fitness(arr1, arr2 = this.sent) {
        // console.log(arr1, arr2);
        let good = 0;
        for (let i = 0; i < arr1.length; ++i) {
            if (arr1[i] == arr2[i]) {
                ++good;
            }
        }
        return good/arr1.length;
    }
    isInArray(arr1, item) {
        for (let i = 0; i < arr1.length; ++i) {
            if (arr1[i] == item) {
                return 0;
            }
        }
        return 1;
    }
    mutate(str) {
        const pos = [[Math.trunc(Math.random()*str.length)], [Math.trunc(Math.random()*str.length)]];
        pos[0].push(str[pos[0][0]]);
        pos[1].push(str[pos[1][0]]);
        // console.log(pos);
        str = str.split("");
        str[pos[0][0]] = pos[1][1];
        str[pos[1][0]] = pos[0][1];
        // console.log(str.join(""));
        return str;
    }
    mate(key1, key2) {
        const arr1 = this.join_an_obj(key1), arr2 = this.join_an_obj(key2);
        const mid = Math.round(arr1.length/2);
        let ans = arr1.slice().split("").splice(0, mid).join(""), i=mid+1;
        // for (let i = mid+1; i < arr1.length; ++i) {
        // console.log(ans.length, arr1.length);
        while (ans.length != arr1.length){
            // console.log(ans);
            if (this.isInArray(ans, arr2[i])) {
                ans+=arr2[i];
            }
            ++i;
            i = i == arr1.length ? 0 : i;
            // console.log(i);
        }
        ans = this.mutate(ans)
        // console.log(this.join_an_obj(key1), this.join_an_obj(key2), ans);
        return this.make_key(ans);
    }
    new_mate(key1, key2) {
        const arr1 = this.join_an_obj(key1), arr2 = this.join_an_obj(key2);
        const mid = Math.round(arr1.length / 2);
        let ans = arr1[0];
        // let ans = arr1.slice().split("").splice(0, mid).join(""), i = mid + 1;
        // for (let i = mid+1; i < arr1.length; ++i) {
        // console.log(ans.length, arr1.length);
        let j = 0, i1 = 1, i2 = 0;
        while (ans.length != arr1.length) {
            if (j % 2) {
                // odd
                while (!this.isInArray(ans, arr1[i1])) ++i1;
                ans+=arr1[i1];
            } else {
                while (!this.isInArray(ans, arr2[i2]))++i2;
                ans += arr2[i2];
            }
            ++j;
            // // console.log(ans);
            // if (this.isInArray(ans, arr2[i])) {
            //     ans += arr2[i];
            // }
            // ++i;
            // i = i == arr1.length ? 0 : i;
            // // console.log(i);
        }
        ans = this.mutate(ans)
        // console.log(this.join_an_obj(key1), this.join_an_obj(key2), ans);
        return this.make_key(ans);
    }
    pick_best(pop, decoded_sentence = this.sent) {
        let max = 0;
        for (let i = 0; i < pop.length; ++i) {
            let q = this.fitness(this.decode(pop[i]), decoded_sentence);
            if (q > max) max = q
        }
        return max;
    }
    make_new_pop() {
        if (!this.it) {
            for (let i = 0; i < 10; ++i) {
                this.pop.push(this.random_key());
            }
        }
        this.pop.push(this.random_key());
        this.pop.push(this.random_key());
        // console.log("FITNESS", this.fitness(this.decode(this.pop[0])));
        this.pop.sort((a, b) => this.fitness(this.decode(b)) - this.fitness(this.decode(a)));
        this.pop.push(this.mate(this.pop[0], this.pop[1]));
        this.pop.push(this.mate(this.pop[Math.trunc(Math.random() * (this.pop.length / 2))], this.pop[Math.trunc(Math.random() * (this.pop.length / 2))]));
        this.pop.push(this.mate(this.pop[Math.trunc(Math.random() * (this.pop.length / 2))], this.pop[Math.trunc(Math.random() * (this.pop.length / 2) + (this.pop.length / 2))]));
        this.pop.push(this.mate(this.pop[Math.trunc(Math.random() * (this.pop.length / 2) + (this.pop.length / 2))], this.pop[Math.trunc(Math.random() * (this.pop.length / 2))]));
        this.pop.push(this.new_mate(this.pop[0], this.pop[1]));
        this.pop.push(this.new_mate(this.pop[Math.trunc(Math.random() * (this.pop.length / 2))], this.pop[Math.trunc(Math.random() * (this.pop.length / 2))]));
        this.pop.push(this.new_mate(this.pop[Math.trunc(Math.random() * (this.pop.length / 2))], this.pop[Math.trunc(Math.random() * (this.pop.length / 2) + (this.pop.length / 2))]));
        this.pop.push(this.new_mate(this.pop[Math.trunc(Math.random() * (this.pop.length / 2) + (this.pop.length / 2))], this.pop[Math.trunc(Math.random() * (this.pop.length / 2))]));
        this.pop.sort((a, b) => this.fitness(this.decode(b)) - this.fitness(this.decode(a)));
        this.pop = this.pop.splice(0, 10);
        // for (let i = 0; i < this.pop.length; ++i) console.log(this.decode(this.pop[i]));
        // console.log("POP", this.pop, this.pop.length, "POP");
        ++this.it;
        return 0;
    }
    // stuff() {
    //     this.make_new_pop();
    //     console.log(this.decode(this.pop[0]), this.it);
    //     // if (q.decode(q.pop[0]) == ans) {
    //     //     cancelAnimationFrame(t);
    //     // }
    //     if (this.decode(this.pop[0]) == this.sent) { console.log(this.pop[0]); clearInterval(this.run); }
    // }
    // train() {
    //     this.run = setInterval(this.stuff, 0);
    // }
}
let ans = "I love you, Sarah...";
let q = new Decode(ans, "joInEFodnfloshrhe???");
// console.log(q.sent);
// console.log(q.fitness());
// console.log(q.random_key());
// let j = q.random_key();
// console.log(j);
// // console.log(q.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
// console.log(q.decode(j, "HELLO"));
// console.log(q.make_new_pop());
// console.log(q.join_an_obj(q.random_key()))
// for (let i = 0; i < 100; ++i) {
const go = () => {
    // let t = window.requestAnimationFrame(go);
    q.make_new_pop();
    console.log(q.decode(q.pop[0]), q.it);
    // if (q.decode(q.pop[0]) == ans) {
    //     cancelAnimationFrame(t);
    // }
    if (q.decode(q.pop[0]) == ans) {
        console.log(q.pop[0]);
        clearInterval(r);
    }
}
let r = setInterval(go, 0);
// q.train()
// const ano = () => {if (q.decode(q.pop[0]) == ans) clearInterval(r)};
// setInterval(ano, 0);
// console.log("FINAL", q.decode(q.pop[0]));
// console.log(q.mutate("ABC"));
// console.log(q.new_mate({"a": "c", "b": "f", "j": "r"}, {"1": "2", "3": "3", "9": "4"}));