#include <node.h>

v8::Persistent<v8::String> cState;
v8::Persistent<v8::String> cValue;
v8::Persistent<v8::String> cReason;
v8::Persistent<v8::String> cFulfilled;
v8::Persistent<v8::String> cRejected;
v8::Persistent<v8::String> cPending;

inline v8::Local<v8::String> InternalizedFromLatin1(v8::Isolate* isolate, const char* data) {
	return v8::String::NewFromOneByte(isolate, reinterpret_cast<const uint8_t*>(data), v8::NewStringType::kInternalized).ToLocalChecked();
}

void ThrowTypeError(v8::Isolate* isolate, const char* message) {
	isolate->ThrowException(v8::Exception::TypeError(InternalizedFromLatin1(isolate, message)));
}

void Inspect(const v8::FunctionCallbackInfo<v8::Value>& info) {
	v8::Isolate* isolate = info.GetIsolate();
	v8::Local<v8::Object> self = info.This();
	if (!self->IsPromise()) return ThrowTypeError(isolate, "Illegal invocation");
	
	v8::Local<v8::Promise> promise = v8::Local<v8::Promise>::Cast(self);
	v8::Local<v8::Context> ctx = isolate->GetCurrentContext();
	v8::Local<v8::Object> obj = v8::Object::New(isolate);
	
	switch (promise->State()) {
		case v8::Promise::PromiseState::kFulfilled:
			obj->Set(ctx, v8::Local<v8::String>::New(isolate, cState), v8::Local<v8::String>::New(isolate, cFulfilled)).FromJust();
			obj->Set(ctx, v8::Local<v8::String>::New(isolate, cValue), promise->Result()).FromJust();
			break;
		case v8::Promise::PromiseState::kRejected:
			obj->Set(ctx, v8::Local<v8::String>::New(isolate, cState), v8::Local<v8::String>::New(isolate, cRejected)).FromJust();
			obj->Set(ctx, v8::Local<v8::String>::New(isolate, cReason), promise->Result()).FromJust();
			break;
		default:
			obj->Set(ctx, v8::Local<v8::String>::New(isolate, cState), v8::Local<v8::String>::New(isolate, cPending)).FromJust();
	}
	
	info.GetReturnValue().Set(obj);
}

void Init(v8::Local<v8::Object> exports, v8::Local<v8::Object> _) {
	v8::Isolate* isolate = v8::Isolate::GetCurrent();
	v8::HandleScope scope(isolate);
	
	cState.Reset(isolate, InternalizedFromLatin1(isolate, "state"));
	cValue.Reset(isolate, InternalizedFromLatin1(isolate, "value"));
	cReason.Reset(isolate, InternalizedFromLatin1(isolate, "reason"));
	cFulfilled.Reset(isolate, InternalizedFromLatin1(isolate, "fulfilled"));
	cRejected.Reset(isolate, InternalizedFromLatin1(isolate, "rejected"));
	cPending.Reset(isolate, InternalizedFromLatin1(isolate, "pending"));
	
	NODE_SET_METHOD(exports, "inspect", Inspect);
}

NODE_MODULE(inspect, Init);
