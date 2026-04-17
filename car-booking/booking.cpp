// booking.cpp - COMPLETE CGI WITHOUT jsoncpp - READY FOR XAMPP
#include <iostream>
#include <string>
#include <cstdlib>
#include <sstream>
#include <map>
#include <cstring>

using namespace std;

// Car price database (₹ per day)
map<string, int> carPrices = {
    {"Verna", 2500},
    {"Thar", 4500},
    {"BMW", 12000},
    {"Fortuner", 6500},
    {"Range Rover", 18000},
    {"Scorpio", 3200},
    {"Nano", 800},
    {"Suzuki", 1800}
};

// Simple JSON response generator (manual)
string jsonResponse(bool success, int totalPrice, const string& car, int days, const string& error = "") {
    if (success) {
        stringstream ss;
        ss << "{\"success\":true,\"totalPrice\":" << totalPrice 
           << ",\"car\":\"" << car << "\",\"days\":" << days << "}";
        return ss.str();
    } else {
        stringstream ss;
        ss << "{\"success\":false,\"error\":\"" << error << "\"}";
        return ss.str();
    }
}

// Read POST data
string readPostData() {
    string data;
    string line;
    
    // Read CONTENT_LENGTH
    char* contentLength = getenv("CONTENT_LENGTH");
    if (contentLength) {
        int len = atoi(contentLength);
        data.resize(len);
        cin.read(&data[0], len);
    } else {
        // Fallback for small POST
        getline(cin, data);
    }
    return data;
}

// Simple URL decode
string urlDecode(const string& str) {
    string decoded;
    for (size_t i = 0; i < str.length(); ++i) {
        if (str[i] == '+') {
            decoded += ' ';
        } else if (str[i] == '%' && i + 2 < str.length()) {
            string hex = str.substr(i + 1, 2);
            char ch = (char)strtol(hex.c_str(), NULL, 16);
            decoded += ch;
            i += 2;
        } else {
            decoded += str[i];
        }
    }
    return decoded;
}

// Parse form data: car=Verna&days=5
map<string, string> parseForm(const string& data) {
    map<string, string> form;
    stringstream ss(data);
    string pair;
    
    while (getline(ss, pair, '&')) {
        size_t eqPos = pair.find('=');
        if (eqPos != string::npos) {
            string key = pair.substr(0, eqPos);
            string value = pair.substr(eqPos + 1);
            form[key] = urlDecode(value);
        }
    }
    return form;
}

int main() {
    // CGI Headers - MUST BE FIRST!
    cout << "Content-Type: application/json;charset=UTF-8\r\n\r\n";
    
    try {
        // Read POST data
        string postData = readPostData();
        
        // Parse form
        map<string, string> formData = parseForm(postData);
        
        // Get parameters
        string carName = formData["car"];
        string daysStr = formData["days"];
        
        // Validate
        if (carName.empty() || daysStr.empty()) {
            cout << jsonResponse(false, 0, "", 0, "Missing car or days") << endl;
            return 0;
        }
        
        int days = atoi(daysStr.c_str());
        if (days <= 0 || days > 365) {
            cout << jsonResponse(false, 0, carName, days, "Days must be 1-365") << endl;
            return 0;
        }
        
        // Check car exists
        if (carPrices.find(carName) == carPrices.end()) {
            cout << jsonResponse(false, 0, carName, days, "Car not available") << endl;
            return 0;
        }
        
        // Calculate price
        int pricePerDay = carPrices[carName];
        int totalPrice = pricePerDay * days;
        
        // SUCCESS!
        cout << jsonResponse(true, totalPrice, carName, days) << endl;
        
    } catch (...) {
        cout << jsonResponse(false, 0, "", 0, "Server error") << endl;
    }
    
    return 0;
}