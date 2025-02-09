import XCTest
import SwiftTreeSitter
import TreeSitterGab

final class TreeSitterGabTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_gab())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Gab grammar")
    }
}
