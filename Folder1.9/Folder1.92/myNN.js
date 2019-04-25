class myNN {
    constructor(inp = 1, inShape = [1], depth = 2, outShape = [1, 1], dataIn, dataOut) {
        // INPUTS: ARRAY OF INPUTS, DEPTH, OUTPUT SHAPE(ignore), INPUT_DATA, OUTPUT_DATA;
        this.depth = depth;
        this.weights = []
        for (let i = 0; i < this.depth; ++i) {
            this.weights.push(1); // To loop later
        }
        // console.log(this.weights);
        this.partials = [];
        this.ans = 0;
        this.loss = 0;
        this.input = inp;
        this.rate = 1;
    }
    feed_with_info(input = this.input, depth = this.depth, weight = this.weights) {
        let arr = [],
        // step = 0,
        pos = input;
        // arr.push([input, weight[step], this.sigmoid(input*weight[step])]);
        // pos = this.sigmoid(input*weight[step]);
        // console.log(arr);
        for (let i = 0; i < depth; ++i) {
            arr.push([pos, weight[i], this.sigmoid(pos * weight[i])]);
            pos = arr[0][2]; // This is the output;
        }
        // arr.push([pos, weight[depth]], )
        // console.log(arr);
        this.partials = arr;
        this.ans = pos;
        this.loss = Math.pow((input - pos), 2);
        // console.log(input, pos);
        // console.log("COMPONENTS", arr);
        return arr;
    }
    to_weight(mini_arr) {
        return mini_arr[2] * (1 - mini_arr[2]) * mini_arr[0];
    }
    cont(mini_arr) {
        return mini_arr[2] * (1 - mini_arr[2]) * mini_arr[1];
    }
    find_partials(par = this.partials) {
        // console.log(par.length);
        let q = 1, final = [];
        for (let x = 0; x < par.length; ++x) { // Position to change;
            q = 1;
            for (let i = 0; i < par.length; ++i) { // Looking at each mini array;
                if (i == x) { // If this is the one we want to change
                    q*=this.to_weight(par[i]);
                } else {
                    q*=this.cont(par[i]);
                }
            }
            final.push([q]);
        }
        // console.log("PART", final);
        return final;
    }
    to_change(inp = this.input, out = this.ans, rate = this.rate, par = this.par) {
        let q = this.find_partials(par);
        for (let i = 0; i < q.length; ++i) {
            // console.log(out);
            q[i] *= (out-inp)*2*rate;
        }
        // console.log("HERE", q);
        return q;
    }
    change_it(w = this.weights) {
        let ch = this.to_change();
        for (let i = 0; i < w.length; ++i) {
            w[i]-=ch[i];
        }
        this.weights = w;
        // console.log(this.weights);
        return w;
    }
    sigmoid(x) {
        return 1/(1+Math.exp(-x));
    }
    repeat(epoch = 5000) {
        let pass_loss = Infinity;
        for (let i = 0; i < epoch; ++i) {
            this.feed_with_info();
            this.change_it();
            // console.log(this.ans, this.loss, this.weights);
            if (this.loss > pass_loss) this.rate*=0.01;
            pass_loss = this.loss;
            if (this.ans == this.input) break;
        }
        console.log(this.ans, this.loss, this.weights);
        // if (!this.weights[0]) 
    }
}
let q = new myNN(0.324);
// q.feed_with_info();
q.repeat();