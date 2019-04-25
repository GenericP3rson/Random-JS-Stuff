/* References: https://www.saedsayad.com/decision_tree.htm
https://www3.nd.edu/~rjohns15/cse40647.sp14/www/content/lectures/23%20-%20Decision%20Trees%202.pdf
*/
class Entropy {
    constructor(data, ref, names) {
        this.data = data; // Data
        this.ref = ref; // What the ans should be
        this.names = names; // The names of the potential areas to split on
        console.log(data, ref, names)
    }

    num_entropy(num) {
        /*
        This'll find the entropy given an array of numbers.
        */
        let tot = num.reduce((a, b) => a + b, 0); // 'Tis my fancy adding function!!!
        let ans = 0,
            prob;
        for (let i = 0; i < num.length; ++i) {
            prob = num[i] / tot;
            ans -= prob * Math.log2(prob);
        }
        return ans;
    }

    BOW(item) { // Basic Bag of Words
        let looked = [[item[0], 1]]; // We'll put the first item in there...
        let seen;
        for (let i = 1; i < item.length; ++i) {
            seen = 0; // Set as false
            for (let j = 0; j < looked.length; ++j) { // Iterates over all the ones we've seen
                if (item[i] == looked[j][0]) {
                    seen = j + 1; // We see it and we make it a true value
                }
            }
            if (!seen) {
                looked.push([item[i], 1]); // Next we add it to the things we've seen
            } else {
                ++looked[seen - 1][1];
            }
        }
        return looked;
    }

    BOW_num(item) {
        /*
        This does not include the nametags, just a 1D array of the number of appearances of each item.
        */
        let looked = this.BOW(item);
        return looked.map((i) => i[1]);
    }

    BOW_name(item) {
        /*
        This does not include the occurances, just a 1D array of the names of each item.
        */
        let looked = this.BOW(item);
        return looked.map((i) => i[0]);
    }

    BOW_prob(item) {
        /*
        This returns the items in a numerial array with the probability of each.
        */
        let looked = this.BOW_num(item),
            tot = looked.reduce((a, b) => a + b, 0),
            final = looked.map((i) => (i / tot));
        return final;
    }

    element_entropy(ele, arr, ref = this.ref) {
        /*
        This will find the elements' entropy relative to the reference.
        INPUT: element to look for, the element's list, the referal list
        RETURNS: number (the entropy of the two items)
        */
        let tot = [];
        for (let i = 0; i < arr.length; ++i) {
            if (ele == arr[i]) {
                tot.push(ref[i]);
            }
        }
        return this.num_entropy(this.BOW_num(tot));
    }

    two_item_entropy(arr, ref = this.ref) {
        let names = this.BOW_name(arr),
        probs = this.BOW_prob(arr),
        ans = 0;
        for (let i = 0; i < names.length; ++i) {
            ans += (probs[i] * this.element_entropy(names[i], arr, ref));
            // console.log(ans, this.element_entropy(arr, items[i], ref));
            // console.log(me[i], items[i], arr, ref, this.element_entropy(items[i], arr, ref));
        }
        return ans;
    }

    gain(arr, ref = this.ref) {
        // This will calculate the info_gain of an arr to a reference
        let entropy_arr = this.two_item_entropy(arr, ref),
        entropy_ref = this.num_entropy(this.BOW_num(ref));
        return entropy_ref - entropy_arr;
    }

    full_where_to_split(data = this.data, ref = this.ref, na = this.names) {
        /*This is EVERYTHING*/
        let tot_info = [];
        for (let i = 0; i < data.length; ++i) {
            tot_info.push([na[i], this.gain(data[i]), i]);
        }
        tot_info.sort((i1, i2) => i2[1] - i1[1]);
        return tot_info[0][0];
    }

    num_where_to_split(data = this.data, ref = this.ref) {
        /*This is EVERYTHING*/
        let tot_info = [];
        for (let i = 0; i < data.length; ++i) {
            tot_info.push([this.gain(data[i]), i]);
        }
        tot_info.sort((i1, i2) => i2[0] - i1[0]);
        return tot_info[0][1];
    }

    find_pos(item, arr) {
        /*
        This just finds the positions of an item in an array. 
        */
        let ans = [];
        for (let i = 0; i < arr.length; ++i) {
            if (item == arr[i]) {
                ans.push(i);
            }
        }
        return ans;
    }

    remake_arr1(item, data = this.data, ref = this.ref) {
        // NO BREAK
        // console.log(this.find_pos(item, data[this.num_where_to_split(data, ref)]));
        let places = this.find_pos(item, data[this.num_where_to_split(data, ref)]),
        new_data = [],
        single;
        for (let i = 0; i < data.length; ++i) {
            single = [];
            for (let j = 0; j < places.length; ++j) {
                single.push(data[i][places[j]]);
                // console.log(i, j, data[i][j]);
            }
            new_data.push(single)
        }
        let new_ref = [];
        for (let i = 0; i < places.length; ++i) {
            new_ref.push(ref[places[i]])
        }
        return [new_data, new_ref];
    }

    remake_arr2(item, data = this.data, ref = this.ref) {
        // YES BREAK
        // console.log(this.find_pos(item, data[this.num_where_to_split(data, ref)]));
        let split = this.num_where_to_split(data, ref),
        places = this.find_pos(item, data[split]),
            new_data = [],
            single;
        data.splice(split, 1);
        for (let i = 0; i < data.length; ++i) {
            single = [];
            for (let j = 0; j < places.length; ++j) {
                single.push(data[i][places[j]]);
                // console.log(i, j, data[i][j]);
            }
            new_data.push(single)
        } 
        let new_ref = [];
        for (let i = 0; i < places.length; ++i) {
            new_ref.push(ref[places[i]])
        }
        return [new_data, new_ref];
    }

    new_split(data = this.data, ref = this.ref) {
        let best = this.num_where_to_split(data, ref),
        names = this.BOW_name(data[best]),
        ans = {};
        for (let i = 0; i < names.length; ++i) {
            // ans[names[i]] = {};
        }
        return names;
    }
}
const outlook = [`Rainy`, `Rainy`, `Overcast`, `Sunny`, "Sunny", "Sunny", "Overcast", "Rainy", "Rainy", "Sunny", "Rainy", "Overcast", "Overcast", "Sunny"];
const temperature = ['Hot', 'Hot', 'Hot', 'Mild', 'Cool', 'Cool', 'Cool', 'Mild', 'Cool', 'Mild', 'Mild', 'Mild', 'Hot', 'Mild'];
const humidity = ['High', 'High', 'High', 'High', 'Normal', 'Normal', 'Normal', 'High', 'Normal', 'Normal', 'Normal', 'High', 'Normal', 'High'];
const windy = ['False', 'True', 'False', 'False', 'False', 'True', 'True', 'False', 'False', 'False', 'True', 'True', 'False', 'True'];
const play = ['No', 'No', 'Yes', 'Yes', 'Yes', 'No', 'Yes', 'No', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'No'];
const data = [outlook, temperature, humidity, windy];
const names = [`OUTLOOK`, `TEMPERATURE`, `HUMIDITY`, `WINDY`];
const x = new Entropy(data, play, names);
try {
    // let q = x.total(play);
    // console.log(q)
    // q = x.BOW_prob(outlook);
    // q = x.element_entropy("Rainy", outlook, play);
    // let q = x.two_item_entropy(windy, play),
    // r = x.num_entropy(x.BOW_num(play));
    // console.log(r - q);
    // console.log(x.num_where_to_split());
    // // console.log(x.new_split())
    // console.log(x.remake_arr2(`Sunny`));
    let q = x.remake_arr2(`Sunny`);
    let z = new Entropy(q[0], q[1], ["temperature", "humidity", "windy"]);
    console.log(z.gain(q[0][0]));
    console.log(z.gain(q[0][1]));
    console.log(z.gain(q[0][2]));
    // console.log(z.num_where_to_split());
    // console.log(z.remake_arr2(`True`));
    // console.log(x.find_pos(`Rainy`, outlook));
}
catch (e) { console.log(e) }