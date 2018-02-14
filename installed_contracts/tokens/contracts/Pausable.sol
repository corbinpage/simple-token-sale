pragma solidity ^0.4.8;

import "./Ownable.sol";


contract Pausable is Ownable {
    /* globals */
    bool public paused;

    /* events */
    event LogPaused(address sender);
    event LogResumed(address sender);

    /* constructor */
    function Pausable() public {
        paused = false;
    }

    /* modifiers */
    modifier onlyPaused() {
        require(paused == true);
        _;
    }

    modifier onlyLive() {
        require(paused == false);
        _;
    }

    /* methods */
    function pause()
        public
        onlyOwner
        onlyLive
        returns (bool success)
    {
        paused = true;
        LogPaused(msg.sender);
        return true;
    }

    function resume()
        public
        onlyOwner
        onlyPaused
        returns (bool success)
    {
        paused = false;
        LogResumed(msg.sender);
        return true;
    }

}
