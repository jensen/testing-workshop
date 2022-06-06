require_relative "./deps.rb"

class Uploader
  def initialize(storage:)
    @storage = storage
  end

  def upload
    @storage.save
  end
end

RSpec.describe Uploader do
  context "local" do
    subject { described_class.new(storage: adapter) }
    
    let(:adapter) { instance_double(FileSystem) }

    before do
      allow(adapter).to receive(:save) { "saved to mocked adapter" }
    end

    describe '#upload' do
      it "saves the file" do
        expect(subject.upload).to eq("saved to mocked adapter")
      end
    end
  end

  context "remote" do
    subject { described_class.new(storage: adapter) }
    
    let(:adapter) { instance_double(S3) }

    before do
      allow(adapter).to receive(:save) { "saved to mocked adapter" }
    end

    describe '#upload' do
      it "saves the file" do
        expect(subject.upload).to eq("saved to mocked adapter")
      end
    end
  end
end