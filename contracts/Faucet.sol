// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Faucet {
    // Số lượng người đầu tư
    uint256 public numOfFunders;

    // Mapping từ index sang địa chỉ người đầu tư
    mapping(uint256 => address) public lutFunders;

    // Mapping để kiểm tra xem một địa chỉ đã đầu tư hay chưa
    mapping(address => bool) public funders;

    // Fallback function để nhận Ether
    receive() external payable {}

    // Hàm thêm funds vào hợp đồng
    function addFunds() external payable {
        // Địa chỉ người đầu tư
        address funder = msg.sender;

        // Nếu người đầu tư chưa tồn tại, thêm vào danh sách
        if (!funders[funder]) {
            uint256 index = numOfFunders++;
            funders[funder] = true;
            lutFunders[index] = funder;
        }
    }

    // Hàm trả về địa chỉ người đầu tư tại một index cụ thể
    function getFundersIndex(uint256 index) external view returns (address) {
        return lutFunders[index];
    }

    // Hàm trả về mảng chứa tất cả địa chỉ người đầu tư
    function getAllFunders() external view returns (address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint256 i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }
        return _funders;
    }

    // Hàm rút funds từ hợp đồng với điều kiện
    function withdraw(uint256 withdrawAmount) external limitWithdraw(withdrawAmount) {
        payable(msg.sender).transfer(withdrawAmount);
    }

    // Modifier kiểm tra điều kiện rút funds
    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 1 * (10**18),
            "Cannot withdraw more than 1ETH"
        );

        _;
    }
}
