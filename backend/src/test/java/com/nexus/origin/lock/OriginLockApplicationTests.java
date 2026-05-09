package com.nexus.origin.lock;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class OriginLockApplicationTests {

    @Test
    void applicationCanBeConstructed() {
        assertDoesNotThrow(OriginLockApplication::new);
    }
}
