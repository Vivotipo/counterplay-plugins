import base64
import json
import tempfile
import unittest
from pathlib import Path
from catalog import collect

class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.plugin = self.root / 'plugins/test.counterplayplugin'
        self.plugin.mkdir(parents=True)
        self.manifest = {'id':'test.plugin','name':'Test','version':'1.0.0','apiVersion':1,'permissions':['document.read'],'commands':[{'id':'run','title':'Run','script':'main.js'}]}
        self.write()
        (self.plugin/'main.js').write_text('counterplay.report("Hello");')
        (self.plugin/'README.md').write_text('A test plugin.')
        (self.plugin/'LICENSE').write_text('MIT License')
        (self.plugin/'community.json').write_text(json.dumps({'author':'Tester','minimumAppVersion':'1.0.0'}))
    def write(self):
        (self.plugin/'manifest.json').write_text(json.dumps(self.manifest))
    def test_deterministic_package(self):
        first=collect(self.root)
        self.assertEqual(first, collect(self.root))
        self.assertEqual(len(first[0]),1)
        body=json.loads(next(iter(first[1].values())))
        self.assertEqual(base64.b64decode(body['files']['main.js']), (self.plugin/'main.js').read_bytes())
    def test_traversal(self):
        self.manifest['commands'][0]['script']='../outside.js'; self.write()
        with self.assertRaises(ValueError): collect(self.root)
    def test_symlink(self):
        (self.plugin/'main.js').unlink(); (self.plugin/'main.js').symlink_to('/etc/passwd')
        with self.assertRaises(ValueError): collect(self.root)
    def test_binary(self):
        (self.plugin/'payload.dylib').write_bytes(b'\xcf\xfa\xed\xfe')
        with self.assertRaises(ValueError): collect(self.root)
    def test_dynamic_execution(self):
        (self.plugin/'main.js').write_text('eval("payload")')
        with self.assertRaises(ValueError): collect(self.root)
    def test_network(self):
        (self.plugin/'main.js').write_text('fetch("https://example.com")')
        with self.assertRaises(ValueError): collect(self.root)
    def test_unsupported_api(self):
        self.manifest['apiVersion']=999; self.write()
        with self.assertRaises(ValueError): collect(self.root)
    def test_changed_version_required(self):
        import shutil
        with tempfile.TemporaryDirectory() as d:
            base=Path(d); shutil.copytree(self.root/'plugins',base/'plugins')
            (self.plugin/'main.js').write_text('counterplay.report("Changed");')
            with self.assertRaises(ValueError): collect(self.root,base)
            self.manifest['version']='1.0.1'; self.write()
            collect(self.root,base)
