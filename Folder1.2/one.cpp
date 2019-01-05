#include <iostream>
#include <fstream>
#include <string>

using namespace std;

int main() {
    string w = "";
    ofstream fout ("words.txt");
    ifstream fin ("text.txt");
    fin >> w;
    cout << w << endl;
    return 0;
}